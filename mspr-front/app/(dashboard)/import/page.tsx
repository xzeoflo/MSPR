"use client";

import { useState, useCallback, useEffect } from "react";
import {
  IconCheck,
  IconUpload,
  IconDatabaseImport,
  IconCode,
  IconLoader2,
  IconX,
  IconBarbell,
  IconRefresh,
  IconSettings,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getAuthToken } from "@/lib/auth";
import { workoutSchema, type Workout } from "@/types/workout";
import { type Exercise } from "@/types/exercise";

type RawExercise = Partial<Exercise> & Record<string, unknown>;
type RawWorkout = Partial<Workout> & {
  exercises?: RawExercise[];
} & Record<string, unknown>;

interface ValidationError {
  id: string;
  row: number;
  workout: RawWorkout;
  message: string;
  isCoherenceError: boolean;
  suggestedTypes: string[];
  errorPaths: string[];
}

export default function ImportWorkoutsPage() {
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [validWorkouts, setValidWorkouts] = useState<Workout[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [expandedJson, setExpandedJson] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => setMounted(true), []);

  const processSingleWorkout = useCallback((raw: RawWorkout, index: number): { workout?: Workout; error?: ValidationError } => {
    const preparedData = {
      ...raw,
      description: raw.description || "Imported workout",
      workoutType: raw.workoutType?.toUpperCase() || "STRENGTH",
      difficulty: (raw.difficulty?.toUpperCase() as any) || "BEGINNER",
      exercises: (raw.exercises || []).map((ex, exIdx) => ({
        ...ex,
        description: ex.description || "Exercise description",
        caloriesBurned: ex.caloriesBurned ?? 0,
        intensityLevel: ex.intensityLevel || raw.difficulty || "BEGINNER",
        sequenceOrder: ex.sequenceOrder ?? exIdx,
        exerciseType: ex.exerciseType?.toUpperCase() || raw.workoutType?.toUpperCase() || "STRENGTH",
      })),
    };

    const result = workoutSchema.safeParse(preparedData);

    if (!result.success) {
      const errorPaths = result.error.issues.map(issue => issue.path.join("."));
      return {
        error: {
          id: crypto.randomUUID(),
          row: index,
          workout: preparedData as RawWorkout,
          message: `${result.error.issues[0].path.join(" → ")}: ${result.error.issues[0].message}`,
          isCoherenceError: false,
          suggestedTypes: [],
          errorPaths
        }
      };
    }

    const workout = result.data;
    const typeMismatch = workout.exercises.find(
      (ex) => ex.exerciseType.toUpperCase() !== workout.workoutType.toUpperCase()
    );

    if (typeMismatch) {
      return {
        error: {
          id: crypto.randomUUID(),
          row: index,
          workout: preparedData as RawWorkout,
          message: `Inconsistency: Workout is ${workout.workoutType} but exercise is ${typeMismatch.exerciseType}`,
          isCoherenceError: true,
          suggestedTypes: Array.from(new Set(workout.exercises.map(ex => ex.exerciseType.toUpperCase()))),
          errorPaths: ['workoutType']
        }
      };
    }

    return { workout };
  }, []);

  const validateData = useCallback((rawData: unknown[]) => {
    const newValid: Workout[] = [];
    const newErrors: ValidationError[] = [];

    rawData.forEach((item, index) => {
      const { workout, error } = processSingleWorkout(item as RawWorkout, index + 1);
      if (workout) newValid.push(workout);
      if (error) newErrors.push(error);
    });

    setValidWorkouts(newValid);
    setErrors(newErrors);
    if (newValid.length > 0) setShowPreview(true);
  }, [processSingleWorkout]);

  const handleUpdateField = (errorId: string, field: string, value: any) => {
    let processedValue = value;

    if (['durationInSeconds', 'repetitions', 'sets', 'caloriesBurned'].some(key => field.includes(key))) {
      processedValue = value === "" ? 0 : parseInt(value, 10);
    }

    setErrors(currentErrors => {
      const errorIndex = currentErrors.findIndex(e => e.id === errorId);
      if (errorIndex === -1) return currentErrors;

      const updatedErrors = [...currentErrors];
      const error = updatedErrors[errorIndex];
      const updatedRaw = JSON.parse(JSON.stringify(error.workout));

      if (field.startsWith("exercises.")) {
        const parts = field.split(".");
        const idx = parseInt(parts[1]);
        const subField = parts[2];
        if (!updatedRaw.exercises) updatedRaw.exercises = [];
        if (!updatedRaw.exercises[idx]) updatedRaw.exercises[idx] = {};
        updatedRaw.exercises[idx][subField] = processedValue;
      } else {
        updatedRaw[field] = processedValue;
      }

      updatedErrors[errorIndex] = { ...error, workout: updatedRaw };
      return updatedErrors;
    });
  };

  const handleManualValidate = (errorId: string) => {
    const error = errors.find(e => e.id === errorId);
    if (!error) return;

    const { workout, error: newError } = processSingleWorkout(error.workout, error.row);

    if (workout) {
      setValidWorkouts(prev => [...prev, workout]);
      setErrors(prev => prev.filter(e => e.id !== errorId));
      toast.success(`Row ${error.row} validated!`);
    } else if (newError) {
      setErrors(prev => prev.map(e => e.id === errorId ? { ...newError, id: errorId } : e));
      toast.error(newError.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        validateData(Array.isArray(json) ? json : [json]);
      } catch {
        toast.error("Invalid JSON");
        setFile(null);
      }
    };
    reader.readAsText(selectedFile);
    e.target.value = "";
  };

  const handleFinalImport = async () => {
    const token = getAuthToken();
    if (!token) return toast.error("Please login");
    setIsImporting(true);
    try {
      const res = await fetch("http://localhost:8080/api/workouts/import", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(validWorkouts)
      });
      if (!res.ok) throw new Error("Import failed");
      toast.success(`${validWorkouts.length} workouts imported!`);
      setFile(null);
      setValidWorkouts([]);
      setErrors([]);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsImporting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Import Library</h1>
          <p className="text-zinc-400 text-xs">{validWorkouts.length} valid workouts ready.</p>
        </div>
        <div className="flex gap-2">
          {file && <Button variant="ghost" size="sm" className="text-xs text-zinc-400" onClick={() => { setFile(null); setErrors([]); setValidWorkouts([]); }}>Reset</Button>}
          <Button disabled={validWorkouts.length === 0 || isImporting} size="sm" onClick={handleFinalImport} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4">
            {isImporting ? <IconLoader2 className="animate-spin mr-2" /> : <IconDatabaseImport size={16} className="mr-2" />}
            Push to DB ({validWorkouts.length})
          </Button>
        </div>
      </div>

      {!file ? (
        <div onClick={() => document.getElementById('file-upload')?.click()} className="flex h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900/50 transition-all">
          <input type="file" id="file-upload" className="hidden" accept=".json" onChange={handleFileUpload} />
          <IconUpload size={28} className="text-zinc-600" />
          <p className="text-xs font-medium text-zinc-500">Drop your JSON workout file here</p>
        </div>
      ) : (
        <div className="space-y-8">
          {errors.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 px-1">Attention Required ({errors.length})</h3>
              {errors.map((err) => (
                <div key={err.id} className="rounded-xl border border-zinc-800 bg-zinc-950/50 overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-900 bg-zinc-900/40">
                    <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Row {err.row}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] text-zinc-500 hover:text-white" onClick={() => setExpandedJson(expandedJson === err.id ? null : err.id)}>
                        <IconCode size={14} className="mr-1" /> JSON
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-600 hover:text-destructive" onClick={() => setErrors(prev => prev.filter(e => e.id !== err.id))}><IconX size={14} /></Button>
                    </div>
                  </div>

                  <div className="p-5 space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="text-[11px] font-mono text-destructive bg-destructive/5 px-3 py-2 rounded border border-destructive/10 flex-1 italic leading-relaxed">
                        {err.message}
                      </div>
                      <Button
                        onClick={() => handleManualValidate(err.id)}
                        variant="outline"
                        className="h-8 text-[10px] font-bold uppercase tracking-wider border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <IconRefresh size={14} className="mr-2" /> Re-validate
                      </Button>
                    </div>

                    <div className="space-y-8">
                      {/* 1. WORKOUT META - RENDU INTELLIGENT */}
                      <div className="space-y-3 px-1">
                        <div className="flex items-center gap-2 text-zinc-400">
                          <IconSettings size={12} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Workout Meta</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* TITLE */}
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Title</label>
                            {err.errorPaths.includes('title') ? (
                              <Input
                                className="h-8 text-xs bg-zinc-900 border-destructive/50 text-zinc-100 focus:border-destructive"
                                value={err.workout.title ?? ""}
                                onChange={(e) => handleUpdateField(err.id, 'title', e.target.value)}
                              />
                            ) : (
                              <div className="h-8 flex items-center text-xs text-zinc-300 px-1 font-medium truncate italic underline underline-offset-4 decoration-zinc-800/50">
                                {err.workout.title || "Untitled"}
                              </div>
                            )}
                          </div>

                          {/* TYPE */}
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Type</label>
                            {(err.errorPaths.includes('workoutType') || err.isCoherenceError) ? (
                              <Select onValueChange={(v) => handleUpdateField(err.id, 'workoutType', v)} value={err.workout.workoutType ?? ""}>
                                <SelectTrigger className="h-8 text-xs bg-zinc-900 border-destructive/50 text-zinc-100">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="STRENGTH">STRENGTH</SelectItem>
                                  <SelectItem value="HIIT">HIIT</SelectItem>
                                  <SelectItem value="CARDIO">CARDIO</SelectItem>
                                  <SelectItem value="CORE">CORE</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="h-8 flex items-center">
                                <Badge variant="outline" className="text-[9px] border-zinc-800 text-zinc-400 h-5 px-1.5 uppercase tracking-tighter font-bold">
                                  {err.workout.workoutType}
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* DIFFICULTY */}
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Difficulty</label>
                            {err.errorPaths.includes('difficulty') ? (
                              <Select onValueChange={(v) => handleUpdateField(err.id, 'difficulty', v)} value={err.workout.difficulty ?? ""}>
                                <SelectTrigger className="h-8 text-xs bg-zinc-900 border-destructive/50 text-zinc-100">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="BEGINNER">BEGINNER</SelectItem>
                                  <SelectItem value="INTERMEDIATE">INTERMEDIATE</SelectItem>
                                  <SelectItem value="ADVANCED">ADVANCED</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="h-8 flex items-center text-xs text-zinc-300 px-1 font-medium uppercase tracking-tighter italic">
                                {err.workout.difficulty}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 2. EXERCISES FIXES */}
                      <div className="space-y-4 pt-2 border-t border-zinc-900">
                        {err.workout.exercises?.map((ex, idx) => (
                          <div key={idx} className={`rounded-lg p-4 border transition-all ${err.errorPaths.some(p => p.startsWith(`exercises.${idx}`)) ? 'bg-zinc-900/40 border-zinc-800' : 'bg-transparent border-zinc-900'}`}>
                            <div className="flex items-center gap-2 text-zinc-300 mb-4">
                              <IconBarbell size={14} className="text-zinc-500" />
                              <span className="text-[9px] font-bold uppercase tracking-wider italic">
                                Exercise #{idx + 1}: {ex.name || 'Untitled'}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-1.5">
                                <label className="text-[9px] font-semibold text-zinc-400 uppercase">Duration (s)</label>
                                <Input
                                  type="number"
                                  className="h-8 text-xs bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-zinc-100"
                                  value={ex.durationInSeconds ?? ""}
                                  onChange={(e) => handleUpdateField(err.id, `exercises.${idx}.durationInSeconds`, e.target.value)}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[9px] font-semibold text-zinc-400 uppercase">Reps</label>
                                <Input
                                  type="number"
                                  className="h-8 text-xs bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-zinc-100"
                                  value={ex.repetitions ?? ""}
                                  onChange={(e) => handleUpdateField(err.id, `exercises.${idx}.repetitions`, e.target.value)}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[9px] font-semibold text-zinc-400 uppercase">Sets</label>
                                <Input
                                  type="number"
                                  className="h-8 text-xs bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-zinc-100"
                                  value={ex.sets ?? ""}
                                  onChange={(e) => handleUpdateField(err.id, `exercises.${idx}.sets`, e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {expandedJson === err.id && (
                    <div className="p-4 bg-black border-t border-zinc-900">
                      <pre className="text-[10px] text-zinc-500 overflow-x-auto leading-relaxed">{JSON.stringify(err.workout, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {validWorkouts.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-zinc-900">
              <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2 text-emerald-500/80">
                  <IconCheck size={16} />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Ready for Import ({validWorkouts.length})</h3>
                </div>
                <Button variant="ghost" size="sm" className="text-[9px] h-6 uppercase font-bold text-zinc-500 hover:text-white" onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>
              </div>
              {showPreview && (
                <div className="rounded-xl border border-zinc-900 bg-zinc-950/50 divide-y divide-zinc-900 shadow-xl">
                  {validWorkouts.map((w, i) => (
                    <div key={i} className="flex items-center justify-between p-3 px-4 hover:bg-zinc-900/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono text-zinc-600">#{i + 1}</span>
                        <p className="text-xs font-medium text-zinc-200">{w.title}</p>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-bold text-zinc-400 border-zinc-800 uppercase">{w.workoutType}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
