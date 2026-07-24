import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { TableDeposito } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { FormDepositoModal } from "./components/form-deposito";

export function DepositoFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Depósitos</PageTitle>
        <PageDescription>Gerenciamento de Depósitos.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <TableDeposito />
        <FormDepositoModal />
      </PageContent>
    </PageContainer>
  );
}
