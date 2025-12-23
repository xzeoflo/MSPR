import CardData from "@/components/ui/card/CardData";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <CardData title="Data" description="Graph de la data">
        Composant data
      </CardData>
      <CardData title="Data" description="Graph de la data">
        Composant data
      </CardData>
      <CardData title="Data" description="Graph de la data">
        Composant data
      </CardData>
    </div>
  );
}
