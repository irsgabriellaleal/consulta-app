import { dbConnection } from "@/src/config/database";

export async function GET() {
  try {
    const connection = await dbConnection;
    const [pacientes] = await connection.query("SELECT * FROM paciente");
    const paciente = paciente[0];
    console.log(paciente);
  } catch (error) {
    console.log(error);
  }
}
