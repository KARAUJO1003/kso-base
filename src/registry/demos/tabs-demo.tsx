import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-sm">
      <TabsList className="w-full">
        <TabsTrigger value="account">Conta</TabsTrigger>
        <TabsTrigger value="password">Senha</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="text-sm text-muted-foreground">
        Altere as informações da sua conta aqui.
      </TabsContent>
      <TabsContent value="password" className="text-sm text-muted-foreground">
        Altere sua senha aqui.
      </TabsContent>
    </Tabs>
  );
}
