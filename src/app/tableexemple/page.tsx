
import { columns } from "./components/columns";
import { DataTable } from "./components/DataTable";
import { getData } from "@/Utils/fetchApi";



export default async function DemoPage() {
  const data = await getData();

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
