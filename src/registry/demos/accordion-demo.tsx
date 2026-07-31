import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AccordionDemo() {
  return (
    <Accordion className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>É acessível?</AccordionTrigger>
        <AccordionContent>Sim, segue o padrão WAI-ARIA.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>É estilizado?</AccordionTrigger>
        <AccordionContent>Sim, com os tokens de tema padrão do projeto.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
