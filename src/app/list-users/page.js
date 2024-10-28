'use client'
import { Input } from "@/src/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/src/components/ui/table";
import { useState, useEffect } from "react";

export default function ListUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Função para buscar usuários da API
  async function fetchUsers() {
    try {
      const response = await fetch('/api/users'); // Verifique se a rota está correta
      if (!response.ok) {
        throw new Error(`Erro na solicitação: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data); // Define o estado `users` com os dados recebidos
      setFilteredUsers(data); // Define `filteredUsers` com os dados iniciais
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  }

  // Atualiza a lista de usuários filtrados quando o termo de pesquisa muda
  useEffect(() => {
    const results = users.filter(user =>
      user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  // Busca os usuários ao carregar o componente
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Lista de Usuários</h1>
      <Input
        type="search"
        placeholder="Pesquisar por nome ou email"
        className="mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Nome</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.nome}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
