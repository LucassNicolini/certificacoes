"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CertificationCard } from "@/components/certification/certification-card";

interface Item {
  name: string;
  level: number;
}

interface Certification {
  name: string;
  description: string;
  languages: string[];
  price: string;
  url: string;
  level: string;
  provider: string;
}

interface ApiResponse {
  certifications: Certification[];
}

export default function Dashboard() {
  const [softName, setSoftName] = useState("");
  const [softLevel, setSoftLevel] = useState(1);
  const [hardName, setHardName] = useState("");
  const [hardLevel, setHardLevel] = useState(1);
  const [toolName, setToolName] = useState("");
  const [toolLevel, setToolLevel] = useState(1);

  const [softSkills, setSoftSkills] = useState<Item[]>([]);
  const [hardSkills, setHardSkills] = useState<Item[]>([]);
  const [tools, setTools] = useState<Item[]>([]);

  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const certifications = data?.certifications ?? [];

  const availableLevels = useMemo(
    () => Array.from(new Set(certifications.map((c) => c.level))),
    [certifications]
  );
  const availableLanguages = useMemo(
    () =>
      Array.from(new Set(certifications.flatMap((c) => c.languages))).sort(),
    [certifications]
  );
  const filtered = useMemo(
    () =>
      certifications.filter((c) => {
        return (
          (selectedLevel === "all" || c.level === selectedLevel) &&
          (selectedLanguage === "all" || c.languages.includes(selectedLanguage))
        );
      }),
    [certifications, selectedLevel, selectedLanguage]
  );

  const getWeakest = (items: Item[]) => {
    if (!items.length) return [];
    const min = Math.min(...items.map((i) => i.level));
    return items.filter((i) => i.level === min);
  };

  const addSoft = () => {
    if (!softName) return;
    setSoftSkills((prev) => [...prev, { name: softName, level: softLevel }]);
    setSoftName("");
    setSoftLevel(1);
  };
  const addHard = () => {
    if (!hardName) return;
    setHardSkills((prev) => [...prev, { name: hardName, level: hardLevel }]);
    setHardName("");
    setHardLevel(1);
  };
  const addTool = () => {
    if (!toolName) return;
    setTools((prev) => [...prev, { name: toolName, level: toolLevel }]);
    setToolName("");
    setToolLevel(1);
  };

  const removeSoft = (i: number) =>
    setSoftSkills((prev) => prev.filter((_, idx) => idx !== i));
  const removeHard = (i: number) =>
    setHardSkills((prev) => prev.filter((_, idx) => idx !== i));
  const removeTool = (i: number) =>
    setTools((prev) => prev.filter((_, idx) => idx !== i));

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    const weakestSoft = getWeakest(softSkills);
    const weakestHard = getWeakest(hardSkills);
    const weakestTools = getWeakest(tools);
    const terms = [...weakestSoft, ...weakestHard, ...weakestTools].map((i) =>
      i.name.toLowerCase()
    );
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          softSkills: weakestSoft,
          hardSkills: weakestHard,
          tools: weakestTools,
        }),
      });
      if (!res.ok) throw new Error();
      const json: ApiResponse = await res.json();
      const filtered = json.certifications.filter((cert) =>
        terms.some(
          (t) =>
            cert.name.toLowerCase().includes(t) ||
            cert.description.toLowerCase().includes(t)
        )
      );
      setData({ certifications: filtered });
    } catch {
      setError("Falha ao buscar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Certificações por PDI</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <div className="space-y-2">
          <h2 className="font-semibold">Soft Skills</h2>
          <Input
            value={softName}
            onChange={(e) => setSoftName(e.target.value)}
            placeholder="Nome da habilidade"
          />
          <Select
            value={softLevel.toString()}
            onValueChange={(v) => setSoftLevel(Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addSoft} className="w-full">
            Adicionar
          </Button>
          <ul className="list-disc pl-5">
            {softSkills.map((s, i) => (
              <li key={i} className="flex justify-between">
                <span>
                  {s.name} (nível {s.level})
                </span>
                <Button size="sm" variant="ghost" onClick={() => removeSoft(i)}>
                  Remover
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold">Hard Skills</h2>
          <Input
            value={hardName}
            onChange={(e) => setHardName(e.target.value)}
            placeholder="Nome da habilidade"
          />
          <Select
            value={hardLevel.toString()}
            onValueChange={(v) => setHardLevel(Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addHard} className="w-full">
            Adicionar
          </Button>
          <ul className="list-disc pl-5">
            {hardSkills.map((h, i) => (
              <li key={i} className="flex justify-between">
                <span>
                  {h.name} (nível {h.level})
                </span>
                <Button size="sm" variant="ghost" onClick={() => removeHard(i)}>
                  Remover
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h2 className="font-semibold">Ferramentas</h2>
          <Input
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
            placeholder="Nome da ferramenta"
          />
          <Select
            value={toolLevel.toString()}
            onValueChange={(v) => setToolLevel(Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addTool} className="w-full">
            Adicionar
          </Button>
          <ul className="list-disc pl-5">
            {tools.map((t, i) => (
              <li key={i} className="flex justify-between">
                <span>
                  {t.name} (nível {t.level})
                </span>
                <Button size="sm" variant="ghost" onClick={() => removeTool(i)}>
                  Remover
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-center">
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Buscando..." : "Buscar"}
        </Button>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cert) => (
          <CertificationCard key={cert.name} certification={cert} />
        ))}
      </div>
    </div>
  );
}
