import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Certification {
  name: string;
  description: string;
  languages: string[];
  price: string;
  url: string;
  level: string;
  provider: string;
}

interface CertificationCardProps {
  certification: Certification;
}

export function CertificationCard({ certification }: CertificationCardProps) {
  return (
    <Card className="flex flex-col h-full bg-muted border-2 border-transparent shadow-lg rounded-2xl transition-all duration-300 ease-in-out hover:translate-y-[-8px] hover:border-primary">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline">{certification.level}</Badge>
          <Badge variant="secondary">{certification.provider}</Badge>
        </div>
        <CardTitle className="text-card-foreground">
          {certification.name}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {certification.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div>
            <span className="font-semibold text-card-foreground">
              Idiomas:{" "}
            </span>
            {certification.languages.join(", ")}
          </div>
          <div>
            <span className="font-semibold text-card-foreground">Preço: </span>
            {certification.price}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className="w-full bg-blue-500 hover:bg-blue-700 transition-colors duration-200"
        >
          <a href={certification.url} target="_blank" rel="noopener noreferrer">
            Ver Certificação
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
