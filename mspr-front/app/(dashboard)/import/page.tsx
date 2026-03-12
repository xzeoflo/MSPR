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

type WorkoutDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
type WorkoutType = "STRENGTH" | "HIIT" | "CARDIO" | "CORE";

type NumericExerciseFields = 'durationInSeconds' | 'repetitions' | 'sets' | 'caloriesBurned';

type RawExercise = Partial<Exercise> & Record<string, unknown>;
type RawWorkout = Partial<Omit<Workout, 'exercises'>> & {
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
      description: (raw.description as string) || "Imported workout",
      workoutType: ((raw.workoutType as string)?.toUpperCase() as WorkoutType) || "STRENGTH",
      difficulty: ((raw.difficulty as string)?.toUpperCase() as WorkoutDifficulty) || "BEGINNER",
      exercises: (raw.exercises || []).map((ex, exIdx) => ({
        ...ex,
        description: (ex.description as string) || "Exercise description",
        caloriesBurned: ex.caloriesBurned as number | undefined,
        intensityLevel: (ex.intensityLevel as string) || (raw.difficulty as string) || "BEGINNER",
        sequenceOrder: (ex.sequenceOrder as number) ?? exIdx,
        exerciseType: (ex.exerciseType as string)?.toUpperCase() || (raw.workoutType as string)?.toUpperCase() || "STRENGTH",
      })),
    };

    const result = workoutSchema.safeParse(preparedData);
    let errorPaths: string[] = [];
    let messages: string[] = [];

    if (!result.success) {
      errorPaths = result.error.issues.map(issue => issue.path.join("."));
      messages = result.error.issues.map(issue => {
        const pathLabel = issue.path.map(p => typeof p === 'number' ? `Ex #${p + 1}` : p).join(" > ");
        return `${pathLabel}: ${issue.message}`;
      });
    }

    const typeMismatch = preparedData.exercises.find(
      (ex) => ex.exerciseType !== preparedData.workoutType
    );

    if (typeMismatch) {
      if (!errorPaths.includes("workoutType")) errorPaths.push("workoutType");
      messages.push(`Inconsistency: Workout is ${preparedData.workoutType} but exercise "${typeMismatch.name}" is ${typeMismatch.exerciseType}.`);
    }

    if (errorPaths.length > 0) {
      return {
        error: {
          id: crypto.randomUUID(),
          row: index,
          workout: preparedData as RawWorkout,
          message: messages.join("|"),
          isCoherenceError: !!typeMismatch,
          suggestedTypes: Array.from(new Set(preparedData.exercises.map(ex => String(ex.exerciseType)))),
          errorPaths
        }
      };
    }

    return { workout: result.data as Workout };
  }, []);

  const handleUpdateField = (errorId: string, field: string, value: string) => {
    let processedValue: string | number | undefined = value;
    if (['durationInSeconds', 'repetitions', 'sets', 'caloriesBurned'].some(key => field.includes(key))) {
      processedValue = value === "" ? undefined : parseInt(value, 10);
    }

    setErrors(currentErrors => {
      const errorIndex = currentErrors.findIndex(e => e.id === errorId);
      if (errorIndex === -1) return currentErrors;

      const updatedErrors = [...currentErrors];
      const error = updatedErrors[errorIndex];
      const updatedRaw = JSON.parse(JSON.stringify(error.workout)) as RawWorkout;

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
      toast.success(`Row ${error.row} fixed and validated!`);
    } else if (newError) {
      setErrors(prev => prev.map(e => e.id === errorId ? { ...newError, id: errorId } : e));
      toast.error("Validation failed. Check remaining red fields.");
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
        const rawData = Array.isArray(json) ? json : [json];
        const newValid: Workout[] = [];
        const newErrors: ValidationError[] = [];

        rawData.forEach((item: unknown, index: number) => {
          const { workout, error } = processSingleWorkout(item as RawWorkout, index + 1);
          if (workout) newValid.push(workout);
          if (error) newErrors.push(error);
        });

        setValidWorkouts(newValid);
        setErrors(newErrors);
        if (newValid.length > 0) setShowPreview(true);
      } catch {
        toast.error("Invalid JSON format");
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
      setFile(null); setValidWorkouts([]); setErrors([]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      toast.error(message);
    } finally {
      setIsImporting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-1 flex-col p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full text-zinc-100">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Import Library</h1>
          <p className="text-zinc-400 text-xs">{validWorkouts.length} valid / {errors.length} to fix</p>
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
          {errors.map((err) => (
            <div key={err.id} className="rounded-xl border border-zinc-800 bg-zinc-950/50 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-900 bg-zinc-900/40">
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Row {err.row} — Resolve issues</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] text-zinc-500 hover:text-white" onClick={() => setExpandedJson(expandedJson === err.id ? null : err.id)}>
                    <IconCode size={14} className="mr-1" /> JSON
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-600 hover:text-destructive" onClick={() => setErrors(prev => prev.filter(e => e.id !== err.id))}><IconX size={14} /></Button>
                </div>
              </div>

              <div className="p-5 space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className="flex flex-col gap-1.5 flex-1">
                    {err.message.split("|").map((msg, i) => (
                      <div key={i} className="text-[11px] font-mono text-destructive bg-destructive/5 px-3 py-2 rounded border border-destructive/10 italic leading-relaxed">
                        {msg}
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => handleManualValidate(err.id)} variant="outline" className="h-9 text-[10px] font-bold uppercase tracking-wider border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 shrink-0">
                    <IconRefresh size={14} className="mr-2" /> Validate Fixes
                  </Button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3 px-1">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <IconSettings size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Workout Meta</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase">Title</label>
                        {err.errorPaths.includes('title') ? (
                          <Input className="h-8 text-xs bg-zinc-900 border-destructive/50 text-zinc-100" value={(err.workout.title as string) ?? ""} onChange={(e) => handleUpdateField(err.id, 'title', e.target.value)} />
                        ) : (
                          <div className="h-8 flex items-center text-xs text-zinc-300 px-1 font-medium italic">{(err.workout.title as string) || "Untitled"}</div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase">Type</label>
                        {err.errorPaths.includes('workoutType') ? (
                          <Select onValueChange={(v) => handleUpdateField(err.id, 'workoutType', v)} value={(err.workout.workoutType as string) ?? ""}>
                            <SelectTrigger className="h-8 text-xs bg-zinc-900 border-destructive/50 text-zinc-100"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="STRENGTH">STRENGTH</SelectItem>
                              <SelectItem value="HIIT">HIIT</SelectItem>
                              <SelectItem value="CARDIO">CARDIO</SelectItem>
                              <SelectItem value="CORE">CORE</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="h-8 flex items-center"><Badge variant="outline" className="text-[9px] border-zinc-800 text-zinc-400 uppercase">{err.workout.workoutType as string}</Badge></div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase">Difficulty</label>
                        {err.errorPaths.includes('difficulty') ? (
                          <Select onValueChange={(v) => handleUpdateField(err.id, 'difficulty', v)} value={(err.workout.difficulty as string) ?? ""}>
                            <SelectTrigger className="h-8 text-xs bg-zinc-900 border-destructive/50 text-zinc-100"><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="BEGINNER">BEGINNER</SelectItem><SelectItem value="INTERMEDIATE">INTERMEDIATE</SelectItem><SelectItem value="ADVANCED">ADVANCED</SelectItem></SelectContent>
                          </Select>
                        ) : (
                          <div className="h-8 flex items-center text-xs text-zinc-300 px-1 font-medium italic">{err.workout.difficulty as string}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-zinc-900">
                    {err.workout.exercises?.map((ex, idx) => {
                      const hasExError = err.errorPaths.some(p => p.startsWith(`exercises.${idx}`));
                      return (
                        <div key={idx} className={`rounded-lg p-4 border transition-all ${hasExError ? 'bg-zinc-900/40 border-zinc-800' : 'bg-transparent border-zinc-900'}`}>
                          <div className="flex items-center gap-2 text-zinc-300 mb-4">
                            <IconBarbell size={14} className="text-zinc-500" />
                            <span className="text-[9px] font-bold uppercase tracking-wider italic">Ex #{idx + 1}: {(ex.name as string) || 'Untitled'}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {(['caloriesBurned', 'durationInSeconds', 'repetitions', 'sets'] as NumericExerciseFields[]).map((field) => {
                              const path = `exercises.${idx}.${field}`;
                              const isError = err.errorPaths.includes(path);
                              return (
                                <div key={field} className="space-y-1.5">
                                  <label className="text-[9px] font-semibold text-zinc-400 uppercase">
                                    {field === 'durationInSeconds' ? 'Duration (s)' : field === 'caloriesBurned' ? 'Calories' : field}
                                  </label>
                                  {isError ? (
                                    <Input
                                      type="number"
                                      placeholder="Missing"
                                      className="h-8 text-xs bg-zinc-950 border-destructive/50 text-white placeholder:text-destructive/40"
                                      value={(ex[field] as string | number) ?? ""}
                                      onChange={(e) => handleUpdateField(err.id, path, e.target.value)}
                                    />
                                  ) : (
                                    <div className="h-8 flex items-center text-xs text-zinc-500 px-1">{(ex[field] as number) ?? 0}</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {expandedJson === err.id && (
                <div className="p-4 bg-black border-t border-zinc-900">
                  <pre className="text-[10px] text-zinc-500 overflow-x-auto">{JSON.stringify(err.workout, null, 2)}</pre>
                </div>
              )}
            </div>
          ))}

          {validWorkouts.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-zinc-900">
              <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2 text-emerald-500/80">
                  <IconCheck size={16} />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Ready for Import ({validWorkouts.length})</h3>
                </div>
                <button className="text-[9px] h-6 uppercase font-bold text-zinc-500 hover:text-white transition-colors" onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
              </div>
              {showPreview && (
                <div className="rounded-xl border border-zinc-900 bg-zinc-950/50 divide-y divide-zinc-900">
                  {validWorkouts.map((w, i) => (
                    <div key={i} className="flex items-center justify-between p-3 px-4">
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
