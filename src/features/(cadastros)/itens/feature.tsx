import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { TableIten } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { FormItenModal } from "./components/form-itens";

export function ItenFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Itens</PageTitle>
        <PageDescription>Gerenciamento de Itens.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <TableIten />
        <FormItenModal />
      </PageContent>
    </PageContainer>
  );
}
