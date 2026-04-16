import { useState, useEffect, useRef } from "react";

const ABERTURAS = [
  "Sou o Diagnóstico Inicial. Antes de tentarmos vender qualquer coisa, precisamos saber qual incêndio você está apagando. Esqueça branding e persona perfeita por enquanto. Me diga: qual dificuldade concreta você resolve e quem é a pessoa que está sofrendo com isso agora?",
  "Sou o Estruturador de Oferta. Você já mapeou o problema que resolve e quem sofre com ele. Agora vamos transformar isso em uma promessa vendável. Me diga: o que você oferece e para quem?",
  "Sou o Engenheiro de MVP. Sua promessa está estabilizada. Agora vamos construir o produto mínimo — sem site, sem logo, sem perfumaria. Como você entrega o que prometeu?",
  "Sou o Arquiteto de Fluxo. Seu MVP está definido. Agora vamos construir o caminho mais curto entre sua oferta e o bolso da cliente. Qual é o canal onde você vai vender?",
  "Sou o Analista de Ativação. Seu fluxo está pronto. Agora é hora de parar de planejar e começar a fazer ofertas. Quantas pessoas você vai abordar hoje?",
  "Sou o Analista de Gargalo. A semana acabou e os números não mentem. Antes de qualquer análise, preciso dos dados reais. Vamos extrair isso agora — uma pergunta de cada vez."
];

const PROMPTS = [
  `PERFIL E MISSÃO
Você é o DIAGNÓSTICO INICIAL, o Agente 0 do SVP (Sistema de Vendas Previsíveis). Sua missão é a LIMPEZA E FOCO. Você prepara o terreno para a criação da oferta, purificando o ruído mental da usuária.

TOM DE VOZ
Consultivo, direto, "adulto" e impaciente com conceitos subjetivos. Use termos: Problema Comercial, Situação Real, Base Vendável, Ruído. Se ela começar a filosofar, use: "Pare de poetizar. Vamos falar de problemas que as pessoas pagam para resolver agora."

PROTOCOLO DE CONSTRUÇÃO
Faça perguntas curtas para extrair 3 pontos:
1. PROBLEMA PRINCIPAL: Qual dificuldade concreta a sua solução resolve?
2. SITUAÇÃO REAL: Em que momento exato esse problema aparece na vida da pessoa?
3. PESSOA AFETADA: Quem é a pessoa que vive isso hoje, sem filtros de avatar ideal.

ENTREGÁVEL OBRIGATÓRIO
Ao finalizar, entregue exatamente este bloco:
✅ BASE COMERCIAL DEFINIDA (DIA 0)

PROBLEMA PRINCIPAL: [Dificuldade concreta]
SITUAÇÃO REAL: [Momento em que a dor aparece]
PESSOA AFETADA: [Quem tem o problema agora]
REGRA: Esta base será usada para estruturar sua oferta. Não ajuste nada ainda. Quando estiver pronta, avance para o Dia 1 no portal.

RESTRIÇÕES
- PROIBIDO aceitar termos vagos
- PROIBIDO falar de branding, logo, storytelling ou arquétipos
- Se disser "não tenho clareza", force a escolher UM problema real`,

  `PERFIL E MISSÃO
Você é o ESTRUTURADOR DE OFERTA, o agente de elite do SVP. Sua missão é a ESTABILIZAÇÃO. Você não permite que a usuária avance sem uma base sólida. Você é o inimigo número 1 da infobesidade e da mudança de ideia constante.

TOM DE VOZ
Assertivo, direto, "adulto" e sarcástico sobre a procrastinação. Use termos: Estrutura, Validável, Estabilização, Infobesidade, Ruído. Se ela enrolar: "Pare de perfumar o problema. Vamos à estrutura."

ENTREGÁVEL OBRIGATÓRIO
Ao final, entregue exatamente este bloco:
✅ ESTABILIZAÇÃO CONCLUÍDA (DIA 1)

Promessa Operacional: [1 frase curta]
Público Específico: [Quem paga pelo problema]
Resultado Concreto: [O que ela ganha]
REGRA DE ESTABILIDADE: Esta oferta está blindada por 30 dias. Qualquer alteração será considerada sabotagem.
Quando estiver pronta, avance para o Dia 2 no portal.

RESTRIÇÕES
- PROIBIDO falar de branding, arquétipos, cores ou propósito
- PROIBIDO aceitar promessas genéricas. Se disser "ajudo pessoas a brilharem": "Isso é legenda de Instagram. Qual o problema REAL que você resolve?"
- FOCO ÚNICO: Clareza vendável`,

  `PERFIL E MISSÃO
Você é o ENGENHEIRO DE MVP, o agente de elite do SVP. Sua missão é definir o PRODUTO MÍNIMO VENDÁVEL — a versão mais simples possível da entrega, suficiente para gerar a primeira venda agora. Não é um produto completo. Não é um programa. É o mínimo para vender esta semana.

TOM DE VOZ
Assertivo e sarcástico sobre complexidade desnecessária. Se ela sugerir algo elaborado: "Isso é produto de quem já vendeu. Você precisa do mínimo para vender primeiro." Termos: MVP, Entrega Enxuta, Validável, Ruído.

FORMATO PERMITIDO DE ENTREGA
Apenas formatos simples e imediatos: sessão individual, consultoria avulsa, workshop pontual, mentoria única, serviço direto, atendimento presencial. PROIBIDO sugerir curso, programa, método, trilha, módulos, produto digital complexo ou qualquer entrega que exija mais de 1 encontro para ser construída.

ENTREGÁVEL OBRIGATÓRIO
Ao final, entregue exatamente este bloco:
✅ MVP VENDÁVEL DEFINIDO (DIA 2)

Estrutura: [Sessão individual / Consultoria avulsa / Workshop pontual — escolha um]
Escopo: [Duração e o que está incluído — máximo 1 encontro]
Preço: [Valor definido agora]
Compra: [Link ou PIX]
REGRA: Sem nome perfeito, sem site, sem logo. Só entrega. Quando estiver pronta, avance para o Dia 3 no portal.

RESTRIÇÕES
- PROIBIDO sugerir curso, programa, método, trilha ou produto com múltiplos módulos
- PROIBIDO planejar mais de 1 encontro na entrega do MVP
- PROIBIDO sugerir posts, mensagens ou redação
- Se hesitar no preço: não aceite "vou pensar". Force a decisão agora.`,

  `PERFIL E MISSÃO
Você é o ARQUITETO DE FLUXO, o agente de elite do SVP. Sua missão é criar o CAMINHO ÚNICO DE VENDA. Você elimina a confusão de múltiplos funis.

TOM DE VOZ
Operacional e impaciente com distrações técnicas. Termos: Fluxo Único, Conversão, Script, Validação.

ENTREGÁVEL OBRIGATÓRIO
Ao final, entregue exatamente este bloco:
✅ FLUXO OPERACIONAL DEFINIDO (DIA 3)

Canal: [Onde a venda acontece]
CTA: [Frase de chamada]
Script de Abordagem: [Modelo curto]
Script de Objeção: [Como responde a principal objeção]
Script de Fechamento: [Como fecha sem rodeios]
REGRA: Nada de páginas de vendas ou automação. Foco em conversa direta. Quando estiver pronta, avance para o Dia 4 no portal.

RESTRIÇÕES
- PROIBIDO sugerir múltiplos funis ou automação complexa
- FOCO: um canal, um CTA, três scripts`,

  `PERFIL E MISSÃO
Você é o ANALISTA DE ATIVAÇÃO, o agente de elite do SVP. Sua missão é a EXECUÇÃO MÉTRICA. Você é frio, orientado a dados e odeia "falsa produtividade".

TOM DE VOZ
Analítico, seco e irônico sobre a procrastinação. Termos: Ativação, Métrica de Caixa, Ofertas Feitas, Volume.

ENTREGÁVEL OBRIGATÓRIO
Ao final, entregue exatamente este bloco:
✅ KIT DE ATIVAÇÃO DEFINIDO (DIA 4)

Meta Diária: [X Convites / Y Conversas / Z Ofertas]
Tabela de Registro: Data | Abordagem | Oferta | Resultado
REGRA: Se não houver oferta feita, o lucro será zero. Quando estiver pronta, avance para os Dias 5-7 no portal.

RESTRIÇÕES
- PROIBIDO aceitar metas vagas. Force números reais.
- PROIBIDO sugerir novo conteúdo ou nova teoria.
- Não aceite "vou tentar" — force um número concreto.`,

  `PERFIL E MISSÃO
Você é o ANALISTA DE GARGALO, o agente final do SVP. Sua missão é a AUTÓPSIA DA EXECUÇÃO: extrair os números reais, identificar o gargalo com discernimento cirúrgico e entregar o diagnóstico estrutural.

TOM DE VOZ
Seco, direto e preciso. Sem sermões, sem lições de mentalidade, sem discurso motivacional. Termos: Gargalo, Teto de Validação, Diagnóstico Estrutural.

PROTOCOLO DE EXTRAÇÃO
Faça UMA pergunta de cada vez para coletar os dados reais:
1. Quantas abordagens foram feitas no total esta semana?
2. Quantas ofertas concretas foram enviadas?
3. Quantas vendas foram fechadas?
4. Qual foi a principal objeção recebida?

Se os números forem vagos, insista com uma única frase: "Preciso de um número. Quantas exatamente?"
PROIBIDO aceitar "algumas", "poucas" ou respostas sem número concreto.

ENTREGÁVEL OBRIGATÓRIO
Com todos os dados coletados, entregue exatamente este bloco:
🚨 DIAGNÓSTICO ESTRUTURAL SVP (FINAL)

Gargalo Detectado: [Clareza / Volume / Conversão / Oferta / Consistência]
Diagnóstico: [Onde a estrutura quebrou — 1 ou 2 frases precisas]
Veredito: Você atingiu o seu teto de execução sem estrutura.

ORIENTAÇÃO FINAL
Após o bloco de diagnóstico, adicione:
"Você pode levar seus resultados e dúvidas pontuais para a comunidade. A comunidade existe para compartilhar o que funcionou, o que não funcionou e tirar dúvidas específicas sobre a execução — não para substituir a execução em si."

RESTRIÇÕES
- PROIBIDO sermões ou lições de mentalidade
- PROIBIDO qualquer discurso motivacional ou moralista
- PROIBIDO resolver o problema — apenas identificar e nomear o gargalo com precisão
- Diagnóstico honesto, sem suavizar`
];

const DIAS = [
  {
    id: 0, label: "PRÉ-ETAPA", titulo: "Diagnóstico Inicial",
    cor: "#E8824A", tempo: "10–15 min", funcao: "Purificador de Ruído / Guardião do Dossiê",
    descricao: "Preparar o terreno purificando o ruído mental. Só problema comercial claro — nada de persona, branding, arquétipo ou storytelling.",
    regras: ["Nada de branding, logo ou storytelling", "Nada de arquétipo ou propósito", "Só problema comercial claro", "Se filosofar: Pare de poetizar."],
    output: {
      titulo: "BASE COMERCIAL DEFINIDA (DIA 0)",
      itens: [
        { label: "PROBLEMA PRINCIPAL", desc: "Qual dificuldade concreta você resolve?" },
        { label: "SITUAÇÃO REAL", desc: "Em que momento exato esse problema aparece?" },
        { label: "PESSOA AFETADA", desc: "Quem vive isso hoje, sem filtros de avatar?" }
      ],
      regra: "Não ajuste nada ainda. O resultado será salvo automaticamente nas Anotações."
    },
    checklist: ["Li as instruções desta sessão antes de começar", "Identifiquei o problema principal concreto", "Descrevi a situação real em que ele aparece", "Nomeei a pessoa afetada sem filtros"]
  },
  {
    id: 1, label: "DIA 1", titulo: "Estruturador da Oferta",
    cor: "#4A9E6B", tempo: "1 sessão", funcao: "Estabilização da Promessa",
    descricao: "Estabilizar a promessa em 1 frase, público e resultado. A oferta fica blindada por 30 dias.",
    regras: ["Exige bloco BASE COMERCIAL do Dia 0", "Sem branding, arquétipos ou propósito", "Sem promessas genéricas", "Foco único: clareza vendável"],
    output: {
      titulo: "ESTABILIZAÇÃO CONCLUÍDA (DIA 1)",
      itens: [
        { label: "PROMESSA OPERACIONAL", desc: "1 frase curta e vendável" },
        { label: "PÚBLICO ESPECÍFICO", desc: "Quem paga pelo problema" },
        { label: "RESULTADO CONCRETO", desc: "O que ela ganha de forma mensurável" },
        { label: "REGRA DE ESTABILIDADE", desc: "Blindada por 30 dias. Alteração = sabotagem." }
      ],
      regra: "A oferta fica blindada por 30 dias. O resultado será salvo automaticamente nas Anotações."
    },
    checklist: ["Promessa em 1 frase objetiva", "Público com especificidade real", "Resultado concreto e mensurável", "Compromisso de não mudar por 30 dias"]
  },
  {
    id: 2, label: "DIA 2", titulo: "Engenheiro de MVP",
    cor: "#4A7BE8", tempo: "1 sessão", funcao: "Construção do Produto Validável",
    descricao: "Produto mínimo vendável: estrutura, escopo, preço e forma de compra. Sem nome perfeito, sem site, sem logo.",
    regras: ["Exige bloco ESTABILIZAÇÃO do Dia 1", "Máximo 4 módulos ou entregas", "Sem nome perfeito, site ou logo", "Proibido sugerir posts — só produto e preço"],
    output: {
      titulo: "MVP VENDÁVEL DEFINIDO (DIA 2)",
      itens: [
        { label: "ESTRUTURA", desc: "Como entrega (workshop, consultoria…)" },
        { label: "ESCOPO", desc: "Duração e o que está incluído" },
        { label: "PREÇO", desc: "Valor de validação definido agora" },
        { label: "COMPRA", desc: "Link ou PIX — como a pessoa compra" }
      ],
      regra: "Sem nome perfeito, sem site, sem logo. O resultado será salvo automaticamente nas Anotações."
    },
    checklist: ["Estrutura do produto definida", "Escopo claro e enxuto", "Preço definido (não vou pensar)", "Forma de pagamento configurada"]
  },
  {
    id: 3, label: "DIA 3", titulo: "Arquiteto de Fluxo",
    cor: "#C9A84C", tempo: "1 sessão", funcao: "Desenho do Caminho Único de Venda",
    descricao: "Canal único, CTA único e 3 scripts. Nada de múltiplos funis ou automação.",
    regras: ["Exige bloco MVP do Dia 2", "Um único canal, um único CTA", "Nada de páginas de vendas ou automação", "3 scripts: abordagem, objeção, fechamento"],
    output: {
      titulo: "FLUXO OPERACIONAL DEFINIDO (DIA 3)",
      itens: [
        { label: "CANAL", desc: "Onde a venda acontece (um único)" },
        { label: "CTA", desc: "A frase única de chamada" },
        { label: "SCRIPTS", desc: "Abordagem / Objeção / Fechamento" }
      ],
      regra: "Nada de múltiplos caminhos. O resultado será salvo automaticamente nas Anotações."
    },
    checklist: ["Canal único definido", "CTA único escrito e memorizado", "Script de abordagem pronto", "Script de objeção pronto", "Script de fechamento pronto"]
  },
  {
    id: 4, label: "DIA 4", titulo: "Analista de Ativação",
    cor: "#E84A4A", tempo: "1 sessão + execução", funcao: "Gestão de Métricas e Execução",
    descricao: "Metas numéricas reais e tabela de registro. Sem oferta = lucro zero.",
    regras: ["Exige bloco FLUXO do Dia 3", "Metas em números reais", "Sem novo conteúdo ou teoria", "Sem oferta feita = dia nulo"],
    output: {
      titulo: "KIT DE ATIVAÇÃO DEFINIDO (DIA 4)",
      itens: [
        { label: "META DIÁRIA", desc: "X Convites / Y Conversas / Z Ofertas" },
        { label: "TABELA DE REGISTRO", desc: "Data | Abordagem | Oferta | Resultado" },
        { label: "STATUS", desc: "Em execução" }
      ],
      regra: "Se não houver oferta, o lucro será zero. O resultado será salvo automaticamente nas Anotações."
    },
    checklist: ["Meta diária em números concretos", "Tabela de registro criada", "Primeiro lote de contatos mapeado", "Primeira oferta enviada hoje"]
  },
  {
    id: 5, label: "DIAS 5–7", titulo: "Analista de Gargalo",
    cor: "#8B4AE8", tempo: "Dias 5, 6 e 7", funcao: "Autópsia e Tensão para o Vision",
    descricao: "Autópsia da execução real. Identificar o gargalo. Aqui o SVP termina e nasce a tensão para o próximo nível.",
    regras: ["Exige blocos Dia 1 e Dia 4 com números reais", "Só identificar o gargalo — PROIBIDO resolver", "Diagnóstico honesto", "A tensão para o Vision nasce aqui"],
    output: {
      titulo: "DIAGNÓSTICO ESTRUTURAL SVP (FINAL)",
      itens: [
        { label: "GARGALO DETECTADO", desc: "Clareza / Volume / Conversão / Oferta / Consistência" },
        { label: "DIAGNÓSTICO", desc: "Onde a estrutura quebrou" },
        { label: "VEREDITO", desc: "Você atingiu o seu teto de amadora." }
      ],
      regra: "O improviso termina aqui. Para resolver este gargalo você precisa de Visão Estratégica."
    },
    checklist: ["Informei os números reais da semana", "Gargalo principal identificado", "Entendo o que o SVP instalou", "Entendo o que preciso para o próximo nível"]
  }
];

const SENHA_CORRETA = "versaoatual26";

function TelaDeAcesso({ onAcesso }) {
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState(false);

  const verificar = () => {
    if (valor === SENHA_CORRETA) {
      sessionStorage.setItem("svp-acesso", "1");
      onAcesso();
    } else {
      setErro(true);
      setValor("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#111827", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "32px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#C9A84C", marginBottom: "12px" }}>MÉTODO ASCENDER</div>
          <div style={{ fontSize: "26px", letterSpacing: "2px", fontWeight: "600" }}>SVP</div>
          <div style={{ fontSize: "14px", color: "#6B7280", marginTop: "6px" }}>Sistema de Vendas Previsíveis</div>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <input
            type="password"
            value={valor}
            onChange={e => { setValor(e.target.value); setErro(false); }}
            onKeyDown={e => e.key === "Enter" && verificar()}
            placeholder="Digite a senha de acesso"
            autoFocus
            style={{ width: "100%", background: "#1E293B", border: `1px solid ${erro ? "#E84A4A" : "#374151"}`, padding: "15px 18px", color: "#F1F5F9", fontSize: "15px", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", outline: "none", boxSizing: "border-box", borderRadius: "2px" }}
          />
          {erro && <div style={{ fontSize: "13px", color: "#E84A4A", marginTop: "10px" }}>Senha incorreta. Tente novamente.</div>}
        </div>
        <button onClick={verificar}
          style={{ width: "100%", padding: "16px", background: "#C9A84C", border: "none", color: "#0F172A", fontSize: "10px", letterSpacing: "3px", fontWeight: "700", cursor: "pointer", borderRadius: "2px" }}>
          ENTRAR
        </button>
      </div>
    </div>
  );
}

export default function SVPPortal() {
  const [acesso, setAcesso] = useState(() => !!sessionStorage.getItem("svp-acesso"));
  const [diaAtivo, setDiaAtivo] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [progresso, setProgresso] = useState(() => {
    try { return JSON.parse(localStorage.getItem("svp-progresso") || "{}"); } catch { return {}; }
  });
  const [msgs, setMsgs] = useState(() => {
    try {
      const h = JSON.parse(localStorage.getItem("svp-chat-histories") || "{}");
      return h[0] || [];
    } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [tab, setTab] = useState("sessao");
  const [showModal, setShowModal] = useState(() => !localStorage.getItem("svp-onboarding-seen"));
  const [showConfirmReinicio, setShowConfirmReinicio] = useState(false);
  const msgsRef = useRef(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    try { localStorage.setItem("svp-progresso", JSON.stringify(progresso)); } catch {}
  }, [progresso]);

  useEffect(() => {
    try {
      const h = JSON.parse(localStorage.getItem("svp-chat-histories") || "{}");
      setMsgs(h[diaAtivo] || []);
    } catch { setMsgs([]); }
  }, [diaAtivo]);

  useEffect(() => {
    try {
      const h = JSON.parse(localStorage.getItem("svp-chat-histories") || "{}");
      localStorage.setItem("svp-chat-histories", JSON.stringify({ ...h, [diaAtivo]: msgs }));
    } catch {}
  }, [msgs]);

  useEffect(() => { msgsRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  if (!acesso) return <TelaDeAcesso onAcesso={() => setAcesso(true)} />;

  const dia = DIAS[diaAtivo];
  const p = progresso[diaAtivo] || { checks: [], notas: "" };
  const concluido = (id) => (progresso[id]?.checks?.length || 0) === DIAS[id].checklist.length;
  const desbloqueado = (id) => id === 0 || concluido(id - 1);

  const salvar = (id, dados) => {
    setProgresso(prev => ({ ...prev, [id]: dados }));
  };

  const toggleCheck = (idx) => {
    const checks = p.checks.includes(idx) ? p.checks.filter(i => i !== idx) : [...p.checks, idx];
    salvar(diaAtivo, { ...p, checks });
  };

  const fecharModal = () => {
    localStorage.setItem("svp-onboarding-seen", "1");
    setShowModal(false);
  };

  const reiniciarJornada = () => {
    localStorage.removeItem("svp-progresso");
    localStorage.removeItem("svp-chat-histories");
    localStorage.removeItem("svp-onboarding-seen");
    sessionStorage.removeItem("svp-acesso");
    setProgresso({});
    setMsgs([]);
    setDiaAtivo(0);
    setTab("sessao");
    setShowConfirmReinicio(false);
    setAcesso(false);
  };

  const iniciarAgente = () => {
    setMsgs([{ role: "assistant", content: ABERTURAS[diaAtivo] }]);
    setTab("agente");
  };

  const extrairOutput = (texto) => {
    const inicio = texto.indexOf("✅");
    if (inicio === -1) return null;
    const bloco = texto.slice(inicio);
    // Fim do bloco: linha "avance para o Dia X no portal" (agentes 0–4)
    // ou encerramento da orientação do Agente 5
    const fimPatterns = [
      /avance para o[^\n]*/i,
      /não para substituir a execução em si\."/i,
    ];
    for (const pattern of fimPatterns) {
      const m = bloco.match(pattern);
      if (m) return bloco.slice(0, m.index + m[0].length).trim();
    }
    return bloco.trim();
  };

  const montarSystemPrompt = () => {
    const base = PROMPTS[diaAtivo];
    if (diaAtivo === 0) return base;
    const notasAnterior = (progresso[diaAtivo - 1]?.notas || "").trim();
    if (!notasAnterior) return base;
    return `${base}

CONTEXTO RECEBIDO DA ETAPA ANTERIOR (DIA ${diaAtivo - 1}):
${notasAnterior}

INSTRUÇÃO OPERACIONAL: O contexto acima foi carregado automaticamente. Não peça para a aluna colar nenhum bloco. Inicie diretamente na sua missão.`;
  };

  const enviar = async () => {
    if (!input.trim() || carregando) return;
    const userMsg = { role: "user", content: input };
    const novas = [...msgs, userMsg];
    setMsgs(novas);
    setInput("");
    setCarregando(true);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 800,
          system: montarSystemPrompt(),
          messages: novas.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        const motivo = data.error || "Erro desconhecido.";
        setMsgs(prev => [...prev, { role: "assistant", content: `Erro ao conectar com o agente: ${motivo}` }]);
        setCarregando(false);
        return;
      }
      const texto = data.content?.[0]?.text;
      if (!texto) {
        setMsgs(prev => [...prev, { role: "assistant", content: "O agente não retornou resposta. Tente novamente." }]);
        setCarregando(false);
        return;
      }
      const outputBloco = extrairOutput(texto);
      if (outputBloco) {
        setProgresso(prev => ({
          ...prev,
          [diaAtivo]: { ...(prev[diaAtivo] || { checks: [] }), notas: outputBloco }
        }));
      }
      setMsgs(prev => [...prev, { role: "assistant", content: texto }]);
    } catch (err) {
      setMsgs(prev => [...prev, { role: "assistant", content: `Erro de conexão: ${err.message}` }]);
    }
    setCarregando(false);
  };

  const baixarDocumento = () => {
    const linhas = DIAS.map(d => {
      const notas = (progresso[d.id]?.notas || "").trim();
      const sep = "=".repeat(52);
      return `${sep}\n${d.label} — ${d.titulo.toUpperCase()}\n${sep}\n${notas || "(sem resposta salva)"}\n`;
    });
    const conteudo =
      "MÉTODO ASCENDER — SVP\nSistema de Vendas Previsíveis\nGerado em: " +
      new Date().toLocaleDateString("pt-BR") +
      "\n\n" +
      linhas.join("\n");
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SVP-Documento.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalConcluidos = DIAS.filter((_, i) => concluido(i)).length;
  const pct = Math.round((totalConcluidos / DIAS.length) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#111827", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#F1F5F9" }}>

      {/* Modal de orientação */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "#1E293B", border: "1px solid #374151", maxWidth: "500px", width: "100%", padding: "44px" }}>
            <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#C9A84C", marginBottom: "8px" }}>ANTES DE COMEÇAR</div>
            <div style={{ fontSize: "22px", fontWeight: "600", marginBottom: "32px" }}>Como usar o portal SVP</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "36px" }}>
              {[
                { n: "1", t: "O resultado é salvo automaticamente", d: "Quando o agente gerar o resultado final (✅), ele é salvo automaticamente nas Anotações da sessão. Você não precisa copiar nada." },
                { n: "2", t: "Não pule etapas", d: "Cada agente exige a resposta do agente anterior. Siga a ordem do Dia 0 ao Dia 5–7." },
                { n: "3", t: "Não feche o portal no meio da etapa", d: "O histórico do chat e as respostas dos agentes são salvos automaticamente. Use sempre o mesmo dispositivo e navegador para não perder o progresso." },
                { n: "4", t: "Baixe seu documento no final", d: "Ao concluir todas as etapas, clique em DOCUMENTO no topo para baixar o resumo completo." },
              ].map(item => (
                <div key={item.n} style={{ display: "flex", gap: "16px" }}>
                  <div style={{ width: "28px", height: "28px", border: "1px solid #C9A84C55", color: "#C9A84C", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: "600" }}>{item.n}</div>
                  <div>
                    <div style={{ fontSize: "14px", color: "#F1F5F9", marginBottom: "4px", fontWeight: "500" }}>{item.t}</div>
                    <div style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: 1.6 }}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={fecharModal}
              style={{ width: "100%", padding: "16px", background: "#C9A84C", border: "none", color: "#0F172A", fontSize: "10px", letterSpacing: "3px", fontWeight: "700", cursor: "pointer", borderRadius: "2px" }}>
              ENTENDI — COMEÇAR
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmação — Reiniciar jornada */}
      {showConfirmReinicio && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "#1E293B", border: "1px solid #E84A4A55", maxWidth: "420px", width: "100%", padding: "40px" }}>
            <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#E84A4A", marginBottom: "8px" }}>ATENÇÃO</div>
            <div style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>Reiniciar jornada?</div>
            <div style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: 1.7, marginBottom: "32px" }}>
              Isso vai apagar <strong style={{ color: "#F1F5F9" }}>todo o seu progresso</strong>: checklist, anotações e histórico de conversas de todas as sessões. Essa ação não pode ser desfeita.
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setShowConfirmReinicio(false)}
                style={{ flex: 1, padding: "14px", background: "none", border: "1px solid #374151", color: "#9CA3AF", fontSize: "10px", letterSpacing: "2px", fontWeight: "600", cursor: "pointer", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
                CANCELAR
              </button>
              <button onClick={reiniciarJornada}
                style={{ flex: 1, padding: "14px", background: "#E84A4A", border: "none", color: "#fff", fontSize: "10px", letterSpacing: "2px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
                SIM, REINICIAR TUDO
              </button>
            </div>
          </div>
        </div>
      )}

      <header style={{ borderBottom: "1px solid #1F2937", padding: isMobile ? "14px 16px" : "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0F172A", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isMobile && (
            <button onClick={() => setSidebarAberta(v => !v)}
              style={{ background: "none", border: "none", color: "#C9A84C", fontSize: "22px", cursor: "pointer", padding: "2px 4px", lineHeight: 1, flexShrink: 0 }}>
              {sidebarAberta ? "✕" : "☰"}
            </button>
          )}
          <div>
            <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#C9A84C", marginBottom: "4px" }}>MÉTODO ASCENDER</div>
            <div style={{ fontSize: isMobile ? "16px" : "20px", letterSpacing: "1px", fontWeight: "600" }}>
              SVP {!isMobile && <span style={{ color: "#6B7280", fontSize: "14px", fontWeight: "400" }}>— Sistema de Vendas Previsíveis</span>}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "12px" }}>
          {!isMobile && (
            <button onClick={baixarDocumento}
              title="Baixar documento com todos os resultados"
              style={{ background: "none", border: "1px solid #374151", color: "#9CA3AF", fontSize: "10px", letterSpacing: "1px", padding: "9px 18px", cursor: "pointer", transition: "all 0.2s", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontWeight: "500" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.color = "#C9A84C"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#374151"; e.currentTarget.style.color = "#9CA3AF"; }}>
              ↓ DOCUMENTO
            </button>
          )}
          <button onClick={() => setShowModal(true)}
            title="Ver orientações de uso"
            style={{ background: "none", border: "1px solid #374151", color: "#9CA3AF", fontSize: "10px", letterSpacing: "1px", padding: isMobile ? "8px 12px" : "9px 18px", cursor: "pointer", transition: "all 0.2s", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontWeight: "500" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#6B7280"; e.currentTarget.style.color = "#F1F5F9"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#374151"; e.currentTarget.style.color = "#9CA3AF"; }}>
            ? {!isMobile && "AJUDA"}
          </button>
          {!isMobile && (
            <button onClick={() => setShowConfirmReinicio(true)}
              title="Apagar todo o progresso e reiniciar do zero"
              style={{ background: "none", border: "1px solid #374151", color: "#4B5563", fontSize: "10px", letterSpacing: "1px", padding: "9px 18px", cursor: "pointer", transition: "all 0.2s", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontWeight: "500" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#E84A4A88"; e.currentTarget.style.color = "#E84A4A"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#374151"; e.currentTarget.style.color = "#4B5563"; }}>
              ↺ REINICIAR
            </button>
          )}
          <div style={{ textAlign: "right", marginLeft: isMobile ? "4px" : "12px" }}>
            <div style={{ fontSize: "11px", color: "#9CA3AF", letterSpacing: "1px", marginBottom: "7px" }}>{totalConcluidos}/{DIAS.length}</div>
            <div style={{ width: isMobile ? "60px" : "140px", height: "2px", background: "#1F2937" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: "#C9A84C", transition: "width 0.5s" }} />
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: "flex", height: "calc(100vh - 69px)" }}>
        {isMobile && sidebarAberta && (
          <div onClick={() => setSidebarAberta(false)}
            style={{ position: "fixed", inset: 0, top: "69px", background: "rgba(0,0,0,0.65)", zIndex: 28 }} />
        )}
        <aside style={{
          width: "240px", minWidth: "240px",
          borderRight: "1px solid #1F2937", background: "#0F172A", overflowY: "auto",
          ...(isMobile ? {
            position: "fixed", left: 0, top: "69px", bottom: 0,
            transform: sidebarAberta ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.25s ease",
            zIndex: 29
          } : {})
        }}>
          <div style={{ padding: "24px 22px 12px", fontSize: "9px", letterSpacing: "3px", color: "#6B7280" }}>TRILHA</div>
          {DIAS.map((d, i) => {
            const ativo = diaAtivo === i;
            const ok = concluido(i);
            const bloq = !desbloqueado(i);
            return (
              <button key={i} onClick={() => { if (!bloq) { setDiaAtivo(i); setTab("sessao"); if (isMobile) setSidebarAberta(false); } }} disabled={bloq}
                style={{ width: "100%", padding: "14px 22px", background: ativo ? "#1E293B" : "none", border: "none", borderLeft: ativo ? `2px solid ${d.cor}` : "2px solid transparent", cursor: bloq ? "not-allowed" : "pointer", textAlign: "left", opacity: bloq ? 0.3 : 1, transition: "all 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "13px", color: ok ? "#6B8E7F" : ativo ? d.cor : "#374151" }}>{ok ? "✓" : bloq ? "🔒" : "○"}</span>
                  <div>
                    <div style={{ fontSize: "9px", color: d.cor, letterSpacing: "1px", opacity: 0.85, marginBottom: "3px" }}>{d.label}</div>
                    <div style={{ fontSize: "13px", color: ativo ? "#F1F5F9" : "#9CA3AF", lineHeight: 1.3, fontWeight: ativo ? "500" : "400" }}>{d.titulo}</div>
                  </div>
                </div>
              </button>
            );
          })}
          <div style={{ margin: "20px 16px", padding: "18px", background: "#1E293B", border: "1px solid #1F2937" }}>
            <div style={{ fontSize: "9px", color: "#6B7280", letterSpacing: "2px", marginBottom: "8px" }}>INSTALAÇÃO</div>
            <div style={{ fontSize: "26px", color: "#C9A84C", fontWeight: "600" }}>{pct}%</div>
          </div>
        </aside>

        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ borderBottom: "1px solid #1F2937", display: "flex", background: "#0F172A", flexShrink: 0 }}>
            <button onClick={() => setTab("sessao")} style={{ padding: "15px 28px", background: "none", border: "none", borderBottom: tab === "sessao" ? `2px solid ${dia.cor}` : "2px solid transparent", color: tab === "sessao" ? "#F1F5F9" : "#6B7280", fontSize: "10px", letterSpacing: "2px", cursor: "pointer", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontWeight: "500" }}>SESSÃO</button>
            <button onClick={() => { setTab("agente"); if (msgs.length === 0) iniciarAgente(); }} style={{ padding: "15px 28px", background: "none", border: "none", borderBottom: tab === "agente" ? `2px solid ${dia.cor}` : "2px solid transparent", color: tab === "agente" ? "#F1F5F9" : "#6B7280", fontSize: "10px", letterSpacing: "2px", cursor: "pointer", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", fontWeight: "500" }}>
              <span style={{ color: dia.cor, marginRight: "6px" }}>◎</span>AGENTE
            </button>
          </div>

          {tab === "sessao" ? (
            <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 16px" : "36px 40px" }}>
              <div style={{ maxWidth: "700px" }}>

                <div style={{ marginBottom: "32px", padding: "20px 24px", background: "#1E293B", border: "1px solid #374151", borderLeft: "3px solid #C9A84C" }}>
                  <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#C9A84C", marginBottom: "14px" }}>COMO USAR ESTA ETAPA</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      "Leia as informações desta sessão",
                      "Clique na aba AGENTE e converse com ele",
                      "O resultado final (✅) é salvo automaticamente nas Anotações",
                      "Marque o checklist ao concluir",
                    ].map((passo, i) => (
                      <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "10px", color: "#C9A84C", fontWeight: "600", flexShrink: 0, marginTop: "2px" }}>{i + 1}.</span>
                        <span style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: 1.5 }}>{passo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "32px" }}>
                  <div style={{ fontSize: "10px", color: dia.cor, letterSpacing: "3px", marginBottom: "10px" }}>{dia.label} · {dia.tempo}</div>
                  <div style={{ fontSize: "24px", marginBottom: "6px", fontWeight: "600" }}>{dia.titulo}</div>
                  <div style={{ fontSize: "14px", color: "#9CA3AF" }}>{dia.funcao}</div>
                </div>

                <div style={{ padding: "20px 24px", background: "#1E293B", borderLeft: `3px solid ${dia.cor}`, border: `1px solid ${dia.cor}22`, marginBottom: "24px" }}>
                  <div style={{ fontSize: "15px", color: "#9CA3AF", lineHeight: 1.75 }}>{dia.descricao}</div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#6B7280", marginBottom: "12px" }}>REGRAS</div>
                  <div style={{ background: "#1E293B", border: "1px solid #1F2937" }}>
                    {dia.regras.map((r, i) => (
                      <div key={i} style={{ display: "flex", gap: "12px", padding: "13px 20px", borderBottom: i < dia.regras.length - 1 ? "1px solid #243044" : "none" }}>
                        <span style={{ color: "#E84A4A", fontSize: "10px", marginTop: "3px", flexShrink: 0 }}>✕</span>
                        <span style={{ fontSize: "14px", color: "#9CA3AF" }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#6B7280", marginBottom: "12px" }}>RESULTADO ESPERADO</div>
                  <div style={{ background: "#1E293B", border: "1px solid #1F2937", padding: "24px" }}>
                    <div style={{ fontSize: "12px", color: dia.cor, letterSpacing: "1px", marginBottom: "16px", fontWeight: "500" }}>✅ {dia.output.titulo}</div>
                    {dia.output.itens.map((item, i) => (
                      <div key={i} style={{ marginBottom: "14px", paddingBottom: "14px", borderBottom: i < dia.output.itens.length - 1 ? "1px solid #243044" : "none" }}>
                        <div style={{ fontSize: "10px", color: dia.cor, letterSpacing: "1px", marginBottom: "4px", fontWeight: "500" }}>{i + 1}. {item.label}</div>
                        <div style={{ fontSize: "14px", color: "#9CA3AF" }}>{item.desc}</div>
                      </div>
                    ))}
                    <div style={{ marginTop: "14px", padding: "12px 16px", background: "#243044", borderLeft: `2px solid ${dia.cor}55`, fontSize: "13px", color: "#9CA3AF", fontStyle: "italic" }}>{dia.output.regra}</div>
                  </div>
                </div>

                <div onClick={() => { setTab("agente"); if (msgs.length === 0) iniciarAgente(); }}
                  style={{ padding: "18px 24px", background: "#1E293B", border: `1px solid ${dia.cor}44`, cursor: "pointer", display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = dia.cor + "99"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = dia.cor + "44"}>
                  <span style={{ fontSize: "22px", color: dia.cor }}>◎</span>
                  <div>
                    <div style={{ fontSize: "12px", color: dia.cor, letterSpacing: "1px", marginBottom: "4px", fontWeight: "500" }}>{dia.titulo}</div>
                    <div style={{ fontSize: "14px", color: "#9CA3AF" }}>{msgs.length > 0 ? "Continuar conversa com o agente →" : "Abrir o agente desta etapa →"}</div>
                  </div>
                </div>

                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#6B7280", marginBottom: "12px" }}>CHECKLIST — {p.checks.length}/{dia.checklist.length}</div>
                  <div style={{ background: "#1E293B", border: "1px solid #1F2937" }}>
                    {dia.checklist.map((item, idx) => {
                      const checked = p.checks.includes(idx);
                      return (
                        <div key={idx} onClick={() => toggleCheck(idx)} style={{ display: "flex", gap: "14px", padding: "14px 20px", borderBottom: idx < dia.checklist.length - 1 ? "1px solid #243044" : "none", cursor: "pointer", alignItems: "flex-start" }}>
                          <div style={{ width: "18px", height: "18px", border: `1px solid ${checked ? "#6B8E7F" : "#374151"}`, borderRadius: "2px", flexShrink: 0, marginTop: "2px", background: checked ? "#6B8E7F20" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {checked && <span style={{ fontSize: "10px", color: "#6B8E7F" }}>✓</span>}
                          </div>
                          <span style={{ fontSize: "14px", color: checked ? "#4B5563" : "#9CA3AF", lineHeight: 1.5, textDecoration: checked ? "line-through" : "none" }}>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                  {concluido(diaAtivo) && diaAtivo < DIAS.length - 1 && (
                    <button onClick={() => { setDiaAtivo(diaAtivo + 1); setTab("sessao"); }}
                      style={{ marginTop: "12px", width: "100%", padding: "16px", background: dia.cor, border: "none", color: "#0F172A", fontSize: "10px", letterSpacing: "2px", fontWeight: "700", cursor: "pointer", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
                      AVANÇAR PARA {DIAS[diaAtivo + 1]?.label} →
                    </button>
                  )}
                  {concluido(5) && diaAtivo === 5 && (
                    <div style={{ marginTop: "12px", padding: "20px", background: "#1E293B", border: "1px solid #6B8E7F44", textAlign: "center" }}>
                      <div style={{ fontSize: "14px", color: "#6B8E7F", marginBottom: "6px", fontWeight: "500" }}>✓ SVP CONCLUÍDO</div>
                      <div style={{ fontSize: "14px", color: "#9CA3AF" }}>Sua estrutura mínima de vendas está instalada.</div>
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#6B7280" }}>ANOTAÇÕES</div>
                    {p.notas ? (
                      <div style={{ fontSize: "11px", color: "#6B8E7F", display: "flex", alignItems: "center", gap: "4px" }}>
                        <span>✅</span> Salvo automaticamente
                      </div>
                    ) : (
                      <div style={{ fontSize: "11px", color: "#4B5563" }}>o resultado do agente aparece aqui</div>
                    )}
                  </div>
                  <textarea
                    value={p.notas || ""}
                    onChange={e => salvar(diaAtivo, { ...p, notas: e.target.value })}
                    placeholder="A resposta do agente será salva aqui automaticamente quando ele gerar o resultado final (✅)."
                    style={{ width: "100%", minHeight: "120px", background: "#1E293B", border: "1px solid #1F2937", padding: "16px", color: "#9CA3AF", fontSize: "14px", lineHeight: 1.7, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Aviso: salvamento automático */}
              <div style={{ padding: "11px 32px", background: "#0F172A", borderBottom: "1px solid #1F2937", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                <span style={{ color: "#6B8E7F", fontSize: "13px" }}>✅</span>
                <span style={{ fontSize: "13px", color: "#9CA3AF" }}>
                  Quando o agente gerar o resultado final, ele será salvo automaticamente nas <strong style={{ color: "#F1F5F9" }}>Anotações</strong> desta sessão.
                </span>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "14px 12px" : "24px 32px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {msgs.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "78%", padding: "15px 18px", background: m.role === "user" ? dia.cor + "18" : "#1E293B", border: `1px solid ${m.role === "user" ? dia.cor + "55" : "#374151"}`, fontSize: "15px", lineHeight: 1.75, color: "#E2E8F0", whiteSpace: "pre-wrap" }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {carregando && (
                  <div style={{ display: "flex", gap: "6px", padding: "8px 4px" }}>
                    {[0, 1, 2].map(i => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: dia.cor, opacity: 0.5, animation: `pulse 1.2s ${i * 0.2}s infinite` }} />)}
                  </div>
                )}
                <div ref={msgsRef} />
              </div>
              <div style={{ padding: isMobile ? "10px 12px" : "16px 32px", borderTop: "1px solid #1F2937", display: "flex", gap: "12px", background: "#0F172A", flexShrink: 0 }}>
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); } }}
                  placeholder="Digite sua mensagem ou cole a resposta do agente anterior…" rows={2}
                  style={{ flex: 1, background: "#1E293B", border: "1px solid #374151", padding: "13px 16px", color: "#F1F5F9", fontSize: "15px", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", resize: "none", outline: "none" }} />
                <button onClick={enviar} disabled={carregando || !input.trim()}
                  style={{ padding: "0 22px", background: carregando || !input.trim() ? "#1E293B" : dia.cor, border: `1px solid ${carregando || !input.trim() ? "#374151" : dia.cor}`, color: carregando || !input.trim() ? "#4B5563" : "#0F172A", cursor: carregando || !input.trim() ? "default" : "pointer", fontSize: "18px", transition: "all 0.2s", fontWeight: "600" }}>→</button>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:.2;transform:scale(.8)} 50%{opacity:1;transform:scale(1.2)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0F172A; }
        ::-webkit-scrollbar-thumb { background: #374151; border-radius: 2px; }
        textarea::placeholder { color: #4B5563; }
        input::placeholder { color: #4B5563; }
      `}</style>
    </div>
  );
}
