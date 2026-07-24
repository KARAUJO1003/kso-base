import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/layout/page-container";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getEnabledModules } from "@/modules/registry";

export default function DashboardPage() {
  const organizacao = getEnabledModules("organizacao");
  const inventario = getEnabledModules("inventario");
  const administrativo = getEnabledModules("administrativo");

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Painel Administrativo</PageTitle>
        <PageDescription>
          Resumo dos módulos ativos neste projeto.
        </PageDescription>
      </PageHeader>
      <PageContent>
        <div className="gap-4 grid md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Organização</CardTitle>
              <CardDescription>
                {organizacao.length} módulo(s) ativo(s)
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Inventário</CardTitle>
              <CardDescription>
                {inventario.length} módulo(s) ativo(s)
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Controle de Usuários</CardTitle>
              <CardDescription>
                {administrativo.length} módulo(s) ativo(s)
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </PageContent>
    </PageContainer>
  );
}
