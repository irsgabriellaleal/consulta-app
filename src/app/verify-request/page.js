import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";

export default function VerifyRequestPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verifique seu email</CardTitle>
          <CardDescription className="text-center">
            Um link de acesso foi enviado para o seu email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center">
            Verifique sua caixa de entrada e clique no link enviado para fazer login.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}