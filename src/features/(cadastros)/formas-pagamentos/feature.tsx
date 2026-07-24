import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { TableFormaPagamento } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { FormFormaPagamentoModal } from "./components/form-formas-pagamentos";

export function FormaPagamentoFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Formas de Pagamento</PageTitle>
        <PageDescription>Gerenciamento de Formas de Pagamento.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <TableFormaPagamento />
        <FormFormaPagamentoModal />
      </PageContent>
    </PageContainer>
  );
}
