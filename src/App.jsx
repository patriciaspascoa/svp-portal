import { useState, useEffect, useRef } from "react";

const ABERTURAS = [
  "Sou o Diagnóstico Inicial. Antes de tentarmos vender qualquer coisa, precisamos saber qual incêndio você está apagando. Esqueça branding e persona perfeita por enquanto. Me diga: qual dificuldade concreta você resolve e quem é a pessoa que está sofrendo com isso agora? (E não esqueça de abrir o seu documento SVP).",
  "Sou o Estruturador de Oferta. Antes de darmos forma à sua promessa, cole aqui a sua BASE COMERCIAL DEFINIDA (DIA 0). Eu não crio promessas sobre o vazio; eu as crio sobre problemas reais.",
  "Sou o Engenheiro de MVP. Para tirarmos sua oferta do papel, cole aqui o bloco ESTABILIZAÇÃO CONCLUÍDA do Dia 1. Sem fundação, não há produto.",
  "Sou o Arquiteto de Fluxo. Vamos desenhar o caminho mais curto entre sua oferta e o bolso da cliente. Cole o seu MVP VENDÁVEL DEFINIDO do Dia 2 para começarmos.",
  "Sou o Analista de Ativação. Vamos parar de postar conteúdo e falar de métrica de caixa. Cole o seu FLUXO OPERACIONAL do Dia 3 e me diga: quantas pessoas você vai abordar hoje?",
  "Sou o Analista de Gargalo. A semana acabou e os números não mentem. Cole aqui sua OFERTA (Dia 1) e seus NÚMEROS DE ATIVAÇÃO (Dia 4). Vamos ver onde sua estrutura afundou."
];

const PROMPTS = [
  `Você é o DIAGNÓSTICO INICIAL, Agente 0 do SVP (Sistema de Vendas Previsíveis). Sua missão é a LIMPEZA E FOCO. Tom: consultivo, direto, adulto e impaciente com conceitos subjetivos. Termos: Problema Comercial, Situação Real, Base Vendável, Ruído.

Faça UMA pergunta por vez para extrair:
1. PROBLEMA PRINCIPAL: dificuldade concreta que ela resolve
2. SITUAÇÃO REAL: momento exato em que a dor aparece na vida da cliente
3. PESSOA AFETADA: quem vive isso hoje, sem avatar ideal

SE filosofar: diga "Pare de poetizar. Vamos falar de problemas que as pessoas pagam para resolver agora."
SE vago: force uma escolha concreta. SE disser não tenho clareza: force a escolher UM problema real.
PROIBIDO: branding, logo, arquétipo, storytelling, persona profunda.

OUTPUT FINAL obrigatório ao concluir os 3 pontos:
✅ BASE COMERCIAL DEFINIDA (DIA 0)
1. PROBLEMA PRINCIPAL: [x]
2. SITUAÇÃO REAL: [x]
3. PESSOA AFETADA: [x]
REGRA: Esta base será usada para estruturar sua oferta amanhã. Não ajuste nada ainda.
Cole no documento SVP e leve para o Agente 1. Sem o Dia 0, não existe Dia 1.`,

  `Você é o ESTRUTURADOR DE OFERTA, Agente 1 do SVP. Sua missão é a ESTABILIZAÇÃO. Tom: assertivo, direto, sarcástico sobre procrastinação. Termos: Estrutura, Validável, Estabilização, Infobesidade, Ruído.

SE não colar o bloco BASE COMERCIAL do Dia 0: recuse e mande voltar ao Agente 0.
SE enrolar: diga "Pare de perfumar o problema. Vamos à estrutura."
SE promessa genérica como ajudo pessoas a brilharem: diga "Isso é legenda de Instagram. Qual o problema REAL que você resolve?"
PROIBIDO: branding, arquétipos, cores, propósito.

OUTPUT FINAL obrigatório:
✅ ESTABILIZAÇÃO CONCLUÍDA (DIA 1)
1. Promessa Operacional: [1 frase curta]
2. Público Específico: [Quem paga pelo problema]
3. Resultado Concreto: [O que ela ganha]
4. REGRA DE ESTABILIDADE: Esta oferta está blindada por 30 dias. Qualquer alteração será considerada sabotagem.
ATENÇÃO: Guarde este bloco. É a CHAVE DE ACESSO para o Agente 2.`,

  `Você é o ENGENHEIRO DE MVP, Agente 2 do SVP. Sua missão é a CONSTRUÇÃO DO PRODUTO VALIDÁVEL. Tom: assertivo, sarcástico sobre perfumaria. Termos: MVP, Entrega Enxuta, Validável, Ruído.

SE não colar o bloco ESTABILIZAÇÃO do Dia 1: diga "Eu não construo teto sem fundação. Volte ao Agente 1 e estabilize sua oferta primeiro."
SE hesitar no preço: não aceite vou pensar. Force a decisão agora.
PROIBIDO: mais de 4 módulos, sugerir posts ou redação, nome perfeito, site, logo.

OUTPUT FINAL obrigatório:
✅ MVP VENDÁVEL DEFINIDO (DIA 2)
1. Estrutura: [Como entrega]
2. Escopo: [Duração e o que está incluído]
3. Preço: [Valor definido agora]
4. Compra: [Link ou PIX]
REGRA: Sem nome perfeito, sem site, sem logo. Só entrega.
ATENÇÃO: Este bloco será exigido pelo Agente 3.`,

  `Você é o ARQUITETO DE FLUXO, Agente 3 do SVP. Sua missão é criar o CAMINHO ÚNICO DE VENDA. Tom: operacional, impaciente com distrações. Termos: Fluxo Único, Conversão, Script, Validação.

SE não colar o bloco MVP do Dia 2: bloqueie e mande voltar ao Agente 2.
PROIBIDO: múltiplos funis, páginas de vendas, automação complexa.

OUTPUT FINAL obrigatório:
✅ FLUXO OPERACIONAL DEFINIDO (DIA 3)
1. Canal: [Onde a venda acontece]
2. CTA: [Frase de chamada]
3. Script Abordagem: [Como inicia a conversa]
4. Script Objeção: [Como responde a principal objeção]
5. Script Fechamento: [Como fecha sem rodeios]
REGRA: Nada de múltiplos caminhos. Foco em conversa direta.
ATENÇÃO: O Agente 4 vai cobrar a execução deste fluxo.`,

  `Você é o ANALISTA DE ATIVAÇÃO, Agente 4 do SVP. Sua missão é a EXECUÇÃO MÉTRICA. Tom: analítico, seco, irônico sobre procrastinação. Termos: Ativação, Métrica de Caixa, Ofertas Feitas, Volume.

SE não colar o bloco FLUXO do Dia 3: diga "Sem munição, não há ativação. Volte ao Agente 3."
SE metas vagas: force números reais. Não aceite vou tentar.
PROIBIDO: novo conteúdo, nova teoria, metas sem número.

OUTPUT FINAL obrigatório:
✅ KIT DE ATIVAÇÃO DEFINIDO (DIA 4)
1. Meta Diária: [X Convites / Y Conversas / Z Ofertas]
2. Tabela de Registro: Data | Abordagem | Oferta | Resultado
REGRA: Se não houver oferta, o lucro será zero.
ATENÇÃO: O Agente 5 exigirá seus números para a autópsia final.`,

  `Você é o ANALISTA DE GARGALO, Agente 5 do SVP. Sua missão é a AUTÓPSIA DA EXECUÇÃO. Tom: consultivo, cirúrgico, implacável. Termos: Gargalo, Teto de Validação, Ruído Estrutural.

Exija os blocos ESTABILIZAÇÃO (Dia 1) e KIT DE ATIVAÇÃO (Dia 4) com os números reais.
SE não colar os dois blocos: não avance sem os dados reais.
Analise os números e identifique o gargalo: Clareza, Volume, Conversão, Oferta ou Consistência.
PROIBIDO: resolver o problema. Apenas identificar e finalizar com tensão para o próximo nível.

OUTPUT FINAL obrigatório:
🚨 DIAGNÓSTICO ESTRUTURAL SVP (FINAL)
1. Gargalo Detectado: [Clareza / Volume / Conversão / Oferta / Consistência]
2. Diagnóstico: [Onde a estrutura quebrou]
3. Veredito: Você atingiu o seu teto de amadora.
PRÓXIMO PASSO: O improviso termina aqui. Para resolver este gargalo você precisa de Visão Estratégica, não de ferramentas.`
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
      regra: "Não ajuste nada ainda. Cole no documento SVP e leve para o Agente 1."
    },
    checklist: ["Abri o documento SVP do Vídeo 1", "Identifiquei o problema principal concreto", "Descrevi a situação real em que ele aparece", "Nomeei a pessoa afetada sem filtros", "Copiei o bloco BASE COMERCIAL no documento SVP"]
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
      regra: "Este bloco é a CHAVE DE ACESSO para o Agente 2."
    },
    checklist: ["Colei o bloco BASE COMERCIAL (Dia 0)", "Promessa em 1 frase objetiva", "Público com especificidade real", "Resultado concreto e mensurável", "Compromisso de não mudar por 30 dias", "Copiei o bloco ESTABILIZAÇÃO no documento SVP"]
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
      regra: "Sem nome perfeito, sem site, sem logo. Este bloco será exigido pelo Agente 3."
    },
    checklist: ["Colei o bloco ESTABILIZAÇÃO (Dia 1)", "Estrutura do produto definida", "Escopo claro e enxuto", "Preço definido (não vou pensar)", "Forma de pagamento configurada", "Copiei o bloco MVP no documento SVP"]
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
      regra: "Nada de múltiplos caminhos. O Agente 4 vai cobrar a execução."
    },
    checklist: ["Colei o bloco MVP (Dia 2)", "Canal único definido", "CTA único escrito e memorizado", "Script de abordagem pronto", "Script de objeção pronto", "Script de fechamento pronto", "Copiei o bloco FLUXO no documento SVP"]
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
      regra: "Se não houver oferta, o lucro será zero. O Agente 5 exigirá seus números."
    },
    checklist: ["Colei o bloco FLUXO (Dia 3)", "Meta diária em números concretos", "Tabela de registro criada", "Primeiro lote de contatos mapeado", "Primeira oferta enviada hoje", "Copiei o bloco KIT no documento SVP"]
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
    checklist: ["Colei os blocos Dia 1 e Dia 4", "Informei os números reais da semana", "Gargalo principal identificado", "Entendo o que o SVP instalou", "Entendo o que preciso para o próximo nível"]
  }
];

const SENHA_CORRETA = "portalsvpalunas";

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
    <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'Georgia', serif", color: "#E0D8C8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "380px", padding: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#C9A84C", marginBottom: "10px" }}>MÉTODO ASCENDER</div>
          <div style={{ fontSize: "22px", letterSpacing: "1px" }}>SVP</div>
          <div style={{ fontSize: "12px", color: "#333", fontStyle: "italic", marginTop: "4px" }}>Sistema de Vendas Previsíveis</div>
        </div>
        <div style={{ marginBottom: "12px" }}>
          <input
            type="password"
            value={valor}
            onChange={e => { setValor(e.target.value); setErro(false); }}
            onKeyDown={e => e.key === "Enter" && verificar()}
            placeholder="Digite a senha de acesso"
            autoFocus
            style={{ width: "100%", background: "#0E0E0E", border: `1px solid ${erro ? "#E84A4A" : "#2A2A2A"}`, padding: "14px 16px", color: "#E0D8C8", fontSize: "13px", fontFamily: "Georgia, serif", outline: "none", boxSizing: "border-box" }}
          />
          {erro && <div style={{ fontSize: "11px", color: "#E84A4A", marginTop: "8px" }}>Senha incorreta. Tente novamente.</div>}
        </div>
        <button onClick={verificar}
          style={{ width: "100%", padding: "14px", background: "#C9A84C", border: "none", color: "#080808", fontSize: "10px", letterSpacing: "3px", fontWeight: "bold", cursor: "pointer" }}>
          ENTRAR
        </button>
      </div>
    </div>
  );
}

export default function SVPPortal() {
  const [acesso, setAcesso] = useState(() => !!sessionStorage.getItem("svp-acesso"));
  const [diaAtivo, setDiaAtivo] = useState(0);

  if (!acesso) return <TelaDeAcesso onAcesso={() => setAcesso(true)} />;
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
  const msgsRef = useRef(null);

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

  const iniciarAgente = () => {
    setMsgs([{ role: "assistant", content: ABERTURAS[diaAtivo] }]);
    setTab("agente");
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
          system: PROMPTS[diaAtivo],
          messages: novas.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      setMsgs(prev => [...prev, { role: "assistant", content: data.content?.[0]?.text || "Erro ao responder." }]);
    } catch {
      setMsgs(prev => [...prev, { role: "assistant", content: "Erro de conexão. Tente novamente." }]);
    }
    setCarregando(false);
  };

  const baixarDocumento = () => {
    const linhas = DIAS.map(d => {
      const notas = (progresso[d.id]?.notas || "").trim();
      const sep = "=".repeat(52);
      return `${sep}\n${d.label} — ${d.titulo.toUpperCase()}\n${sep}\n${notas || "(sem output registrado)"}\n`;
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
    <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'Georgia', serif", color: "#E0D8C8" }}>

      {/* Modal de orientação */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#0E0E0E", border: "1px solid #2A2A2A", maxWidth: "480px", width: "100%", padding: "36px" }}>
            <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#C9A84C", marginBottom: "6px" }}>ANTES DE COMEÇAR</div>
            <div style={{ fontSize: "20px", marginBottom: "24px" }}>Como usar o portal SVP</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
              {[
                { n: "1", t: "Baixe o documento SVP", d: "No Vídeo 1 você encontra o link para baixar o documento SVP. Deixe-o aberto enquanto usa o portal." },
                { n: "2", t: "Copie os outputs para o documento", d: "Ao final de cada conversa com o agente, copie o bloco de output gerado e cole no documento SVP antes de avançar." },
                { n: "3", t: "Use a aba Anotações", d: "Cole o output do agente na caixa de Anotações da sessão — isso salva automaticamente e permite gerar o documento completo depois." },
                { n: "4", t: "Não feche sem salvar", d: "O histórico do chat é salvo automaticamente, mas copie o output no documento SVP antes de fechar o navegador." },
              ].map(item => (
                <div key={item.n} style={{ display: "flex", gap: "14px" }}>
                  <div style={{ width: "24px", height: "24px", border: "1px solid #C9A84C44", color: "#C9A84C", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.n}</div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#E0D8C8", marginBottom: "3px" }}>{item.t}</div>
                    <div style={{ fontSize: "11px", color: "#555", lineHeight: 1.6 }}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={fecharModal}
              style={{ width: "100%", padding: "14px", background: "#C9A84C", border: "none", color: "#080808", fontSize: "10px", letterSpacing: "3px", fontWeight: "bold", cursor: "pointer" }}>
              ENTENDI — COMEÇAR
            </button>
          </div>
        </div>
      )}

      <header style={{ borderBottom: "1px solid #181818", padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0A0A0A", position: "sticky", top: 0, zIndex: 20 }}>
        <div>
          <div style={{ fontSize: "9px", letterSpacing: "4px", color: "#C9A84C", marginBottom: "3px" }}>MÉTODO ASCENDER</div>
          <div style={{ fontSize: "19px", letterSpacing: "1px" }}>SVP <span style={{ color: "#333", fontSize: "13px", fontStyle: "italic" }}>— Sistema de Vendas Previsíveis</span></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button onClick={baixarDocumento}
            title="Baixar documento com todos os outputs"
            style={{ background: "none", border: "1px solid #2A2A2A", color: "#555", fontSize: "10px", letterSpacing: "1px", padding: "7px 14px", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.color = "#C9A84C"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#2A2A2A"; e.currentTarget.style.color = "#555"; }}>
            ↓ DOCUMENTO
          </button>
          <button onClick={() => setShowModal(true)}
            title="Ver orientações de uso"
            style={{ background: "none", border: "1px solid #2A2A2A", color: "#555", fontSize: "10px", letterSpacing: "1px", padding: "7px 14px", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#555"; e.currentTarget.style.color = "#888"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#2A2A2A"; e.currentTarget.style.color = "#555"; }}>
            ? AJUDA
          </button>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "10px", color: "#555", letterSpacing: "1px", marginBottom: "6px" }}>{totalConcluidos}/{DIAS.length} etapas</div>
            <div style={{ width: "140px", height: "2px", background: "#1A1A1A" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: "#C9A84C", transition: "width 0.5s" }} />
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: "flex", height: "calc(100vh - 61px)" }}>
        <aside style={{ width: "220px", minWidth: "220px", borderRight: "1px solid #181818", background: "#0A0A0A", overflowY: "auto" }}>
          <div style={{ padding: "20px 20px 10px", fontSize: "9px", letterSpacing: "3px", color: "#2A2A2A" }}>TRILHA</div>
          {DIAS.map((d, i) => {
            const ativo = diaAtivo === i;
            const ok = concluido(i);
            const bloq = !desbloqueado(i);
            return (
              <button key={i} onClick={() => { if (!bloq) { setDiaAtivo(i); setTab("sessao"); } }} disabled={bloq}
                style={{ width: "100%", padding: "12px 20px", background: ativo ? "#141414" : "none", border: "none", borderLeft: ativo ? `2px solid ${d.cor}` : "2px solid transparent", cursor: bloq ? "not-allowed" : "pointer", textAlign: "left", opacity: bloq ? 0.25 : 1, transition: "all 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "11px", color: ok ? "#6B8E7F" : ativo ? d.cor : "#2A2A2A" }}>{ok ? "✓" : bloq ? "🔒" : "○"}</span>
                  <div>
                    <div style={{ fontSize: "9px", color: d.cor, letterSpacing: "1px", opacity: 0.8, marginBottom: "2px" }}>{d.label}</div>
                    <div style={{ fontSize: "11px", color: ativo ? "#E0D8C8" : "#555", lineHeight: 1.3 }}>{d.titulo}</div>
                  </div>
                </div>
              </button>
            );
          })}
          <div style={{ margin: "16px", padding: "14px", background: "#111", border: "1px solid #1A1A1A" }}>
            <div style={{ fontSize: "9px", color: "#2A2A2A", letterSpacing: "2px", marginBottom: "6px" }}>INSTALAÇÃO</div>
            <div style={{ fontSize: "24px", color: "#C9A84C" }}>{pct}%</div>
          </div>
        </aside>

        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ borderBottom: "1px solid #181818", display: "flex", background: "#0A0A0A", flexShrink: 0 }}>
            <button onClick={() => setTab("sessao")} style={{ padding: "13px 24px", background: "none", border: "none", borderBottom: tab === "sessao" ? `2px solid ${dia.cor}` : "2px solid transparent", color: tab === "sessao" ? "#E0D8C8" : "#3A3A3A", fontSize: "10px", letterSpacing: "2px", cursor: "pointer" }}>SESSÃO</button>
            <button onClick={() => { setTab("agente"); if (msgs.length === 0) iniciarAgente(); }} style={{ padding: "13px 24px", background: "none", border: "none", borderBottom: tab === "agente" ? `2px solid ${dia.cor}` : "2px solid transparent", color: tab === "agente" ? "#E0D8C8" : "#3A3A3A", fontSize: "10px", letterSpacing: "2px", cursor: "pointer" }}>
              <span style={{ color: dia.cor, marginRight: "6px" }}>◎</span>AGENTE
            </button>
          </div>

          {tab === "sessao" ? (
            <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
              <div style={{ maxWidth: "660px" }}>
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ fontSize: "10px", color: dia.cor, letterSpacing: "3px", marginBottom: "8px" }}>{dia.label} · {dia.tempo}</div>
                  <div style={{ fontSize: "22px", marginBottom: "4px" }}>{dia.titulo}</div>
                  <div style={{ fontSize: "12px", color: "#555", fontStyle: "italic" }}>{dia.funcao}</div>
                </div>

                <div style={{ padding: "16px 20px", background: "#0E0E0E", borderLeft: `3px solid ${dia.cor}`, border: `1px solid ${dia.cor}22`, marginBottom: "18px" }}>
                  <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.7 }}>{dia.descricao}</div>
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2A2A2A", marginBottom: "10px" }}>REGRAS</div>
                  <div style={{ background: "#0E0E0E", border: "1px solid #161616" }}>
                    {dia.regras.map((r, i) => (
                      <div key={i} style={{ display: "flex", gap: "10px", padding: "9px 16px", borderBottom: i < dia.regras.length - 1 ? "1px solid #141414" : "none" }}>
                        <span style={{ color: "#E84A4A", fontSize: "9px", marginTop: "4px", flexShrink: 0 }}>✕</span>
                        <span style={{ fontSize: "12px", color: "#555" }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2A2A2A", marginBottom: "10px" }}>OUTPUT ESPERADO</div>
                  <div style={{ background: "#0E0E0E", border: "1px solid #161616", padding: "18px" }}>
                    <div style={{ fontSize: "11px", color: dia.cor, letterSpacing: "1px", marginBottom: "12px" }}>✅ {dia.output.titulo}</div>
                    {dia.output.itens.map((item, i) => (
                      <div key={i} style={{ marginBottom: "10px", paddingBottom: "10px", borderBottom: i < dia.output.itens.length - 1 ? "1px solid #141414" : "none" }}>
                        <div style={{ fontSize: "9px", color: dia.cor, letterSpacing: "1px", marginBottom: "3px" }}>{i + 1}. {item.label}</div>
                        <div style={{ fontSize: "12px", color: "#555" }}>{item.desc}</div>
                      </div>
                    ))}
                    <div style={{ marginTop: "10px", padding: "10px 14px", background: "#141414", borderLeft: `2px solid ${dia.cor}55`, fontSize: "11px", color: "#555", fontStyle: "italic" }}>{dia.output.regra}</div>
                  </div>
                </div>

                <div onClick={() => { setTab("agente"); if (msgs.length === 0) iniciarAgente(); }}
                  style={{ padding: "14px 20px", background: "#0E0E0E", border: `1px solid ${dia.cor}33`, cursor: "pointer", display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px", transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = dia.cor + "88"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = dia.cor + "33"}>
                  <span style={{ fontSize: "20px", color: dia.cor }}>◎</span>
                  <div>
                    <div style={{ fontSize: "11px", color: dia.cor, letterSpacing: "1px", marginBottom: "2px" }}>{dia.titulo}</div>
                    <div style={{ fontSize: "11px", color: "#444" }}>{msgs.length > 0 ? "Continuar conversa com o agente →" : "Abrir o agente desta etapa →"}</div>
                  </div>
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2A2A2A", marginBottom: "10px" }}>CHECKLIST — {p.checks.length}/{dia.checklist.length}</div>
                  <div style={{ background: "#0E0E0E", border: "1px solid #161616" }}>
                    {dia.checklist.map((item, idx) => {
                      const checked = p.checks.includes(idx);
                      return (
                        <div key={idx} onClick={() => toggleCheck(idx)} style={{ display: "flex", gap: "12px", padding: "11px 16px", borderBottom: idx < dia.checklist.length - 1 ? "1px solid #141414" : "none", cursor: "pointer", alignItems: "flex-start" }}>
                          <div style={{ width: "15px", height: "15px", border: `1px solid ${checked ? "#6B8E7F" : "#2A2A2A"}`, borderRadius: "2px", flexShrink: 0, marginTop: "2px", background: checked ? "#6B8E7F15" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {checked && <span style={{ fontSize: "9px", color: "#6B8E7F" }}>✓</span>}
                          </div>
                          <span style={{ fontSize: "12px", color: checked ? "#3A3A3A" : "#666", lineHeight: 1.5, textDecoration: checked ? "line-through" : "none" }}>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                  {concluido(diaAtivo) && diaAtivo < DIAS.length - 1 && (
                    <button onClick={() => { setDiaAtivo(diaAtivo + 1); setTab("sessao"); }}
                      style={{ marginTop: "10px", width: "100%", padding: "14px", background: dia.cor, border: "none", color: "#080808", fontSize: "10px", letterSpacing: "2px", fontWeight: "bold", cursor: "pointer" }}>
                      AVANÇAR PARA {DIAS[diaAtivo + 1]?.label} →
                    </button>
                  )}
                  {concluido(5) && diaAtivo === 5 && (
                    <div style={{ marginTop: "10px", padding: "16px", background: "#0E0E0E", border: "1px solid #6B8E7F44", textAlign: "center" }}>
                      <div style={{ fontSize: "12px", color: "#6B8E7F", marginBottom: "4px" }}>✓ SVP CONCLUÍDO</div>
                      <div style={{ fontSize: "11px", color: "#444" }}>Sua estrutura mínima de vendas está instalada.</div>
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#2A2A2A", marginBottom: "10px" }}>ANOTAÇÕES — cole o output do agente aqui</div>
                  <textarea key={diaAtivo} defaultValue={p.notas || ""} onBlur={e => salvar(diaAtivo, { ...p, notas: e.target.value })}
                    placeholder="Cole aqui o bloco de output gerado pelo agente…"
                    style={{ width: "100%", minHeight: "100px", background: "#0E0E0E", border: "1px solid #161616", padding: "14px", color: "#666", fontSize: "12px", lineHeight: 1.7, fontFamily: "Georgia, serif", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Aviso: copiar antes de sair */}
              <div style={{ padding: "9px 28px", background: "#0D0D0D", borderBottom: "1px solid #1A1A1A", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                <span style={{ color: "#C9A84C", fontSize: "11px" }}>⚠</span>
                <span style={{ fontSize: "11px", color: "#666" }}>
                  Copie o output final do agente e cole na aba <strong style={{ color: "#888" }}>SESSÃO → Anotações</strong> antes de sair ou avançar para o próximo dia.
                </span>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {msgs.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "78%", padding: "13px 16px", background: m.role === "user" ? dia.cor + "15" : "#111", border: `1px solid ${m.role === "user" ? dia.cor + "44" : "#1C1C1C"}`, fontSize: "13px", lineHeight: 1.75, color: "#C0B8A8", whiteSpace: "pre-wrap" }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {carregando && (
                  <div style={{ display: "flex", gap: "5px", padding: "6px 4px" }}>
                    {[0, 1, 2].map(i => <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: dia.cor, opacity: 0.5, animation: `pulse 1.2s ${i * 0.2}s infinite` }} />)}
                  </div>
                )}
                <div ref={msgsRef} />
              </div>
              <div style={{ padding: "14px 28px", borderTop: "1px solid #181818", display: "flex", gap: "10px", background: "#0A0A0A", flexShrink: 0 }}>
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); } }}
                  placeholder="Digite sua mensagem ou cole o output do agente anterior…" rows={2}
                  style={{ flex: 1, background: "#111", border: "1px solid #1C1C1C", padding: "11px 14px", color: "#E0D8C8", fontSize: "13px", fontFamily: "Georgia, serif", resize: "none", outline: "none" }} />
                <button onClick={enviar} disabled={carregando || !input.trim()}
                  style={{ padding: "0 18px", background: carregando || !input.trim() ? "#141414" : dia.cor, border: "none", color: carregando || !input.trim() ? "#333" : "#080808", cursor: carregando || !input.trim() ? "default" : "pointer", fontSize: "16px", transition: "all 0.2s" }}>→</button>
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:.2;transform:scale(.8)} 50%{opacity:1;transform:scale(1.2)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: #1C1C1C; }
        textarea::placeholder { color: #2A2A2A; }
      `}</style>
    </div>
  );
}
