import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/layout/page-container";
import { Separator } from "@/components/ui/separator";
import { SystemsTable } from "./components/systems-table";

export function SystemsFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Sistemas</PageTitle>
        <PageDescription>Gerenciamento dos sistemas de acesso.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <SystemsTable />
      </PageContent>
    </PageContainer>
  );
}
