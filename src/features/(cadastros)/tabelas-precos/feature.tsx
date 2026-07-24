import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { TableTabelasPrecos } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { FormTabelasPrecosModal } from "./components/form-tabelas-precos";
import { AdicionarPrecoItemModal } from "./components/adicionar-preco-item-modal";

export function TabelasPrecosFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Tabela de Preço</PageTitle>
        <PageDescription>Gerencie suas tabelas de preços aqui.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <TableTabelasPrecos />
        <FormTabelasPrecosModal />
        <AdicionarPrecoItemModal />
      </PageContent>
    </PageContainer>
  );
}
