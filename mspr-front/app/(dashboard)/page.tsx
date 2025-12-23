import Card from "@/components/ui/card/Card";

// app/(dashboard)/page.js
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <Card title="Data" description="This is the card for the data" >Data</Card>
      <Card title="Graph" description="This is the card for the Graph" >Graph</Card>
      <Card title="Users" description="This is the card for the Users" >Users</Card>
    </div>
  )
}
