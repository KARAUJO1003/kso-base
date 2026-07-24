/**
 * Template for feature main component
 * @module feature
 */

/**
 * Generate feature.tsx template
 * @param {object} params - Template parameters
 * @param {string} params.PASCAL - PascalCase module name
 * @param {string} params.KEBAB - kebab-case module name
 * @param {string} params.pageTitle - Page title
 * @param {string} params.pageDescription - Page description
 * @returns {string} Feature template
 */
export function featureTemplate(params) {
  const { PASCAL, KEBAB, pageTitle, pageDescription } = params;

  return `import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { Table${PASCAL} } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { Form${PASCAL}Modal } from "./components/form-${KEBAB}";

export function ${PASCAL}Feature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>${pageTitle}</PageTitle>
        <PageDescription>${pageDescription}</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <Table${PASCAL} />
        <Form${PASCAL}Modal />
      </PageContent>
    </PageContainer>
  );
}
`;
}
