import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'

// Mapeamento de categorias para os UUIDs do banco
const categoryIdMap = {
  'Informática/TI': '1984b34e-5742-4569-8a54-eb20b815b507',
  'Elétrica': '12273c10-aeaa-46e3-a6c7-ed4075b33e1a',
  'Predial/Civil': '0fcf339b-107a-458b-bb94-60072a199435',
  'Segurança Eletrônica': '8113b9a2-f488-4a2d-acc8-23c9f8fee6ee',
  'Telecomunicações': '05d993fd-6c01-41eb-8fed-64fd377eb996'
};
const categoryNameMap = Object.fromEntries(
  Object.entries(categoryIdMap).map(([name, id]) => [id, name])
);

function App() {
  const [user] = useState({ email: 'suporte@empresa.com', id: 'admin' })
  
  const [activeTab, setActiveTab] = useState('Painel Geral')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNotifyOpen, setIsNotifyOpen] = useState(false)
  const [filter, setFilter] = useState('Todos')
  const [showToast, setShowToast] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [createdTicket, setCreatedTicket] = useState(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [userAvatar, setUserAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Paula')
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const avatarOptions = [
    'Paula', 'Felix', 'Aneka', 'Max', 'Luna', 'Leo', 'Mia', 'Zoe'
  ].map(seed => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`)
  
  // Categorias Oficiais
  const categories = [
    'Todos', 
    'Informática/TI', 
    'Elétrica', 
    'Predial/Civil', 
    'Segurança Eletrônica', 
    'Telecomunicações'
  ]

  const categoryColors = {
    'Todos': 'text-white border-white/20 bg-white/5',
    'Informática/TI': 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5',
    'Elétrica': 'text-amber-400 border-amber-400/20 bg-amber-400/5',
    'Predial/Civil': 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
    'Segurança Eletrônica': 'text-rose-400 border-rose-400/20 bg-rose-400/5',
    'Telecomunicações': 'text-purple-400 border-purple-400/20 bg-purple-400/5'
  }

  // Estado de Chamados com a nova segmentação
  const [tickets, setTickets] = useState([
    {
      id: '#TK-8241',
      db_id: 'mock-1',
      title: 'Acesso lento ao servidor de arquivos',
      type: 'Informática/TI',
      priority: 'Alta',
      status: 'Em Atendimento',
      user: 'Financeiro',
      date: new Date().toLocaleString()
    },
    {
      id: '#TK-5122',
      db_id: 'mock-2',
      title: 'Manutenção preventiva quadro elétrico',
      type: 'Elétrica',
      priority: 'Média',
      status: 'Pendente',
      user: 'Manutenção',
      date: new Date().toLocaleString()
    }
  ])

  const [notifications] = useState([
    { id: 1, text: "Novo chamado crítico em Informática/TI", time: "Agora", type: "urgent" },
    { id: 2, text: "Manutenção Elétrica programada para as 14h", time: "15 min atrás", type: "info" },
  ])

  const [newTicket, setNewTicket] = useState({ title: '', type: 'Informática/TI', priority: 'Média', user: 'Geral' })

  const fetchTickets = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        const formatted = data.map(t => ({
          id: t.ticket_no ? `#TK-${t.ticket_no}` : `#TK-${t.id?.toString().slice(0,4)}`,
          db_id: t.id,
          title: t.subject || 'Sem Assunto',
          description: t.description || '',
          type: categoryNameMap[t.category_id] || t.type || 'Geral',
          priority: t.priority || 'Média',
          status: t.status || 'Pendente',
          user: t.assigned_to || t.requester || 'Não Atribuído',
          date: new Date(t.created_at).toLocaleString('pt-BR')
        }));
        setTickets(prev => {
          const mocks = prev.filter(p => p.db_id?.toString().startsWith('mock-'));
          return [...formatted, ...mocks];
        });
      }
    } catch (err) {
      console.error('Erro ao buscar chamados:', err);
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch initial tickets
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTickets();
  }, [fetchTickets]);

  const handleLogout = () => {
    // No-op for now as login is removed
    alert('Logoff desativado no modo sem login.');
  }
  
  const handleAddTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ticketNumber = Math.floor(Math.random() * 9000) + 1000;
    const uiId = `#TK-${ticketNumber}`;

    const ticketData = {
      ticket_no: ticketNumber,
      subject: newTicket.title,
      category_id: categoryIdMap[newTicket.type] || categoryIdMap['Informática/TI'],
      priority: newTicket.priority,
      status: 'Pendente',
      description: `Solicitado por: ${newTicket.user || 'Paula Admin'}`
    };

    const { data, error } = await supabase
      .from('tickets')
      .insert([ticketData])
      .select();

    if (error) {
      console.error('ERRO SUPABASE INSERT:', error);
      alert('Erro ao criar chamado: ' + error.message);
      setAuthError(error.message);
    } else {
      const entry = {
        id: uiId,
        db_id: data[0].id,
        title: newTicket.title,
        description: ticketData.description,
        type: newTicket.type,
        priority: newTicket.priority,
        status: 'Pendente',
        user: newTicket.user || 'Paula Admin',
        date: new Date().toLocaleString('pt-BR')
      };
      setTickets([entry, ...tickets]);
      setCreatedTicket(entry);
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setNewTicket({ title: '', type: 'Informática/TI', priority: 'Média', user: 'Geral' });
    }
    setLoading(false);
  }

  const handleAssumeTicket = async (ticket) => {
    setLoading(true);
    const { error } = await supabase
      .from('tickets')
      .update({ status: 'Em Atendimento' })
      .eq('id', ticket.db_id);

    if (!error) {
      setTickets(tickets.map(t => t.db_id === ticket.db_id ? { ...t, status: 'Em Atendimento' } : t));
      setSelectedTicket({ ...ticket, status: 'Em Atendimento' });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } else {
      console.error('ERRO SUPABASE ASSUME:', error);
      alert('Erro ao assumir chamado: ' + error.message);
      setAuthError(error.message);
    }
    setLoading(false);
  }

  const handleCancelTicket = async (ticket) => {
    if (!window.confirm(`Cancelar o chamado ${ticket.id}?`)) return;
    setLoading(true);
    const { error } = await supabase
      .from('tickets')
      .update({ status: 'Cancelado' })
      .eq('id', ticket.db_id);

    if (!error) {
      setTickets(tickets.map(t => t.db_id === ticket.db_id ? { ...t, status: 'Cancelado' } : t));
      setIsDetailModalOpen(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } else {
      console.error('ERRO SUPABASE CANCEL:', error);
      alert('Erro ao cancelar chamado: ' + error.message);
      setAuthError(error.message);
    }
    setLoading(false);
  }

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsDetailModalOpen(true);
  }

  const handleServiceSelect = (service) => {
    const categoryMapping = {
      "Redes & Conectividade": "Informática/TI",
      "Sistemas Operacionais": "Informática/TI",
      "Hardware & Periféricos": "Informática/TI",
      "Segurança de Dados": "Informática/TI",
      "Cloud & Virtualização": "Informática/TI",
      "Telefonia IP": "Telecomunicações",
      "Suporte Remoto": "Informática/TI",
      "Gestão de Ativos": "Informática/TI",
      "Cibersegurança": "Segurança Eletrônica",
      "Consultoria T.I.": "Informática/TI",
      "Backup Cloud": "Informática/TI",
      "E-mail Corporate": "Informática/TI"
    };

    setNewTicket({
      title: `Solicitação de ${service.title}`,
      type: categoryMapping[service.title] || "Informática/TI",
      priority: "Média",
      user: "Paula Admin"
    });
    setIsModalOpen(true);
  }

  const filteredTickets = tickets.filter(t => {
    const matchesFilter = filter === 'Todos' || t.type === filter;
    const matchesSearch = (t.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (t.id?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-[#050507] text-[#f4f4f5] font-sans antialiased min-h-screen selection:bg-blue-500/30 overflow-hidden">
      <AnimatePresence mode="wait">
          {/* DASHBOARD PRINCIPAL */}
          <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-screen">
            {/* SIDEBAR */}
            <aside className="bg-[#0a0a0c]/90 backdrop-blur-3xl h-screen w-72 fixed left-0 top-0 border-r border-white/5 flex flex-col py-8 z-30">
              <div className="px-8 mb-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center">
                  <span className="material-symbols-outlined text-white font-bold">shield_with_heart</span>
                </div>
                <h1 className="text-lg font-black text-white uppercase tracking-tighter">SUPORTE<span className="text-blue-500"> TÉCNICO</span></h1>
              </div>
              <nav className="flex-1 px-4 space-y-1">
                <NavItem active={activeTab === 'Painel Geral'} onClick={() => setActiveTab('Painel Geral')} icon="dashboard" label="Painel Geral" />
                <NavItem active={activeTab === 'Gestão de Chamados'} onClick={() => setActiveTab('Gestão de Chamados')} icon="confirmation_number" label="Gerenciamento" />
                <NavItem active={activeTab === 'Catálogo Global'} onClick={() => setActiveTab('Catálogo Global')} icon="grid_view" label="Catálogo" />
                <NavItem active={activeTab === 'Configurações'} onClick={() => setActiveTab('Configurações')} icon="settings" label="Ajustes" />
              </nav>
              <div className="px-6 mt-auto">
                <button onClick={handleLogout} className="w-full py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#a1a1aa] hover:text-red-500 transition-colors">Sair</button>
              </div>
            </aside>

            {/* MAIN AREA */}
            <div className="flex-1 ml-72 h-screen overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050507] to-[#050507]">
              <header className="h-20 flex justify-between items-center px-10 border-b border-white/5 backdrop-blur-md sticky top-0 z-20">
                <h2 className="text-xs font-black text-[#a1a1aa] uppercase tracking-widest">{activeTab}</h2>
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#a1a1aa] group-focus-within:text-blue-500 transition-colors">search</span>
                    <input 
                      type="text" 
                      placeholder="Buscar chamados..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-2xl py-2 pl-12 pr-4 text-xs text-white focus:border-blue-500 outline-none transition-all w-64 placeholder:text-white/20"
                    />
                  </div>
                  <div className="h-8 w-px bg-white/10 mx-2"></div>
                  <button 
                    onClick={() => { setLoading(true); fetchTickets(); }}
                    disabled={loading}
                    className="w-10 h-10 rounded-xl glass hover:bg-white/10 border-white/10 flex items-center justify-center text-[#a1a1aa] hover:text-white transition-all group"
                  >
                    <span className={`material-symbols-outlined text-[20px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
                  </button>
                  <div className="relative">
                    <HeaderBtn icon="notifications" badge onClick={() => setIsNotifyOpen(!isNotifyOpen)} />
                    <AnimatePresence>
                      {isNotifyOpen && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-4 w-80 glass border-white/10 rounded-3xl p-6 shadow-2xl z-50">
                          <h4 className="text-sm font-black text-white uppercase mb-4">Alertas Recentes</h4>
                          <div className="space-y-4">
                            {notifications.map(n => (
                              <div key={n.id} className="p-3 bg-white/5 rounded-xl border-l-2 border-blue-500">
                                <p className="text-xs text-white leading-tight mb-1">{n.text}</p>
                                <span className="text-[10px] text-[#a1a1aa]">{n.time}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="h-8 w-px bg-white/10 mx-2"></div>
                  <button 
                    onClick={() => setActiveTab('Configurações')}
                    className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-2xl transition-all group"
                  >
                    <div className="text-right">
                      <p className="text-[10px] font-black text-white uppercase group-hover:text-blue-400 transition-colors">Paula Suporte</p>
                      <p className="text-[8px] text-green-500 font-bold uppercase tracking-tighter">Online</p>
                    </div>
                    <div className="relative">
                      <img className="w-10 h-10 rounded-full border-2 border-blue-500/30 group-hover:border-blue-500 transition-all" src={userAvatar} alt="Paula" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#050507] rounded-full"></div>
                    </div>
                  </button>
                </div>
              </header>

              <main className="p-10 max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                  {activeTab === 'Painel Geral' && (
                    <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="flex justify-between items-end mb-10">
                        <h2 className="text-4xl font-black text-white leading-tight">Bom dia, <span className="text-gradient">Paula</span></h2>
                        <button onClick={() => setIsModalOpen(true)} className="accent-gradient h-14 px-8 rounded-2xl text-white font-bold text-sm shadow-xl flex items-center gap-2">
                          <span className="material-symbols-outlined">add_circle</span> NOVO CHAMADO
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <StatCard title="Total Chamados" value={tickets.length} icon="analytics" />
                        <StatCard title="Em Atendimento" value={tickets.filter(t => t.status === 'Em Atendimento').length} icon="pending" color="text-blue-500" />
                        <StatCard title="Urgência Alta" value={tickets.filter(t => t.priority === 'Crítica').length} icon="priority_high" color="text-red-500" />
                        <StatCard title="SLA Cumprido" value="98.4%" icon="verified" color="text-green-500" />
                      </div>
                      
                      {/* Segmentação por Categorias */}
                      <div className="flex gap-2 mb-6 overflow-x-auto pb-4 scrollbar-hide">
                          {categories.map(cat => (
                            <button
                              key={cat}
                              onClick={() => setFilter(cat)}
                              className={`px-5 py-2 shrink-0 rounded-xl text-[10px] font-black border transition-all ${
                                filter === cat 
                                  ? categoryColors[cat].replace('bg-', 'bg-opacity-20 bg-') + ' shadow-lg'
                                  : 'bg-white/5 text-[#94a3b8] border-white/5 hover:bg-white/10'
                              }`}
                            >
                              {cat.toUpperCase()}
                            </button>
                          ))}
                        </div>

                        <div className="glass rounded-[32px] p-8 border-white/5">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Atividade Recente</h3>
                            <span className="text-[10px] font-black text-[#a1a1aa] uppercase tracking-widest">{filteredTickets.length} REGISTROS</span>
                          </div>
                          <div className="space-y-4">
                            {filteredTickets.map(t => <TicketItem key={t.db_id} {...t} colorClass={categoryColors[t.type]} onClick={() => handleTicketClick(t)} />)}
                          </div>
                        </div>
                    </motion.div>
                  )}

                  {activeTab === 'Gestão de Chamados' && (
                    <motion.div key="mgmt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-black text-white uppercase">Tabela de <span className="text-gradient">Chamados</span></h2>
                        <div className="flex gap-3">
                           <button className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"><span className="material-symbols-outlined text-sm">filter_list</span> Filtrar</button>
                           <button className="bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20"><span className="material-symbols-outlined text-sm">download</span> Exportar</button>
                        </div>
                      </div>
                      <div className="glass rounded-[32px] overflow-hidden border-white/5">
                        <table className="w-full text-left">
                          <thead className="bg-white/5 text-[10px] uppercase font-black text-[#a1a1aa] border-b border-white/5">
                            <tr>
                              <th className="p-6">ID / Ticket</th>
                              <th className="p-6">Assunto</th>
                              <th className="p-6">Categoria</th>
                              <th className="p-6">Prioridade</th>
                              <th className="p-6">Status</th>
                              <th className="p-6 text-right">Ação</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {tickets.map(t => (
                              <tr key={t.db_id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="p-6 text-xs font-mono text-blue-500">{t.id}</td>
                                <td className="p-6">
                                  <p className="text-sm font-bold text-white leading-tight">{t.title}</p>
                                  <p className="text-[10px] text-[#a1a1aa] mt-1">{t.user}</p>
                                </td>
                                <td key={t.id + "-type"} className="p-6">
                                  <span className={`text-[9px] font-black px-3 py-1 rounded-lg border ${categoryColors[t.type]}`}>{t.type}</span>
                                </td>
                                <td className="p-6">
                                  <span className={`text-[9px] font-black px-2 py-1 rounded bg-white/5 border ${t.priority === 'Crítica' ? 'text-red-500 border-red-500/20' : 'text-blue-500 border-blue-500/20'}`}>{t.priority}</span>
                                </td>
                                <td className="p-6">
                                  <div className="flex items-center gap-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'Em Atendimento' ? 'bg-blue-500 animate-pulse' : 'bg-[#a1a1aa]'}`}></span>
                                    <span className="text-xs text-[#a1a1aa]">{t.status}</span>
                                  </div>
                                </td>
                                <td className="p-6 text-right">
                                  <button className="material-symbols-outlined text-sm text-[#a1a1aa] hover:text-white transition-colors">settings_input_component</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'Catálogo Global' && (
                    <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-black text-white uppercase">Catálogo de <span className="text-gradient">Serviços</span></h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[
                          { title: "Redes & Conectividade", desc: "Configuração de roteadores, switches e pontos de acesso.", icon: "router", color: "text-blue-500", border: "hover:border-blue-500/30" },
                          { title: "Sistemas Operacionais", desc: "Suporte para Windows, macOS e Linux Enterprise.", icon: "terminal", color: "text-cyan-500", border: "hover:border-cyan-500/30" },
                          { title: "Hardware & Periféricos", desc: "Manutenção de impressoras, scanners e desktops.", icon: "computer", color: "text-emerald-500", border: "hover:border-emerald-500/30" },
                          { title: "Segurança de Dados", desc: "Backup, recuperação e firewalls de nova geração.", icon: "lock", color: "text-rose-500", border: "hover:border-rose-500/30" },
                          { title: "Cloud & Virtualização", desc: "Gestão de instâncias AWS, Azure e ambientes Proxmox.", icon: "cloud", color: "text-purple-500", border: "hover:border-purple-500/30" },
                          { title: "Telefonia IP", desc: "Configuração de PABX Virtual e ramais VoIP.", icon: "voip_off", color: "text-amber-500", border: "hover:border-amber-500/30" },
                          { title: "Suporte Remoto", desc: "Acesso remoto seguro para resolução ágil de problemas.", icon: "settings_remote", color: "text-indigo-500", border: "hover:border-indigo-500/30" },
                          { title: "Gestão de Ativos", desc: "Inventário e monitoramento de hardware e licenças.", icon: "inventory_2", color: "text-slate-400", border: "hover:border-slate-400/30" },
                          { title: "Cibersegurança", desc: "Proteção proativa contra ameaças e monitoramento SOC.", icon: "security", color: "text-red-500", border: "hover:border-red-500/30" },
                          { title: "Consultoria T.I.", desc: "Planejamento estratégico e otimização de infraestrutura.", icon: "psychology", color: "text-orange-500", border: "hover:border-orange-500/30" },
                          { title: "Backup Cloud", desc: "Armazenamento redundante e seguro em múltiplos datacenters.", icon: "backup", color: "text-sky-500", border: "hover:border-sky-500/30" },
                          { title: "E-mail Corporate", desc: "Gestão de servidores Exchange, Google Workspace e M365.", icon: "mail", color: "text-pink-500", border: "hover:border-pink-500/30" }
                        ].map((item, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => handleServiceSelect(item)}
                            className={`glass p-6 rounded-[32px] border-white/5 ${item.border} transition-all group cursor-pointer card-shine`}
                          >
                            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${item.color} mb-6 group-hover:scale-110 transition-transform`}>
                              <span className="material-symbols-outlined">{item.icon}</span>
                            </div>
                            <h4 className="text-sm font-black text-white mb-2 leading-tight">{item.title}</h4>
                            <p className="text-[10px] text-[#94a3b8] leading-relaxed mb-6 h-10 overflow-hidden">{item.desc}</p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleServiceSelect(item); }}
                                className={`text-[9px] font-black ${item.color} uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all`}
                            >
                                Solicitar <span className="material-symbols-outlined text-sm">add_circle</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'Configurações' && (
                    <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-black text-white uppercase">Ajustes do <span className="text-gradient">Sistema</span></h2>
                      </div>
                      <div className="max-w-2xl space-y-8">
                        <section className="glass p-8 rounded-[32px] border-white/5">
                          <h4 className="text-sm font-black text-white uppercase mb-6 tracking-widest">Perfil Profissional</h4>
                          <div className="flex items-center gap-6 mb-8">
                            <div className="relative group cursor-pointer" onClick={() => setActiveTab('Configurações')}>
                                <img className="w-20 h-20 rounded-3xl border-2 border-blue-500/30 p-1 group-hover:border-blue-500 transition-all" src={userAvatar} alt="Paula" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-white">photo_camera</span>
                                </div>
                            </div>
                            <div>
                              <p className="text-lg font-black text-white">Paula Admin</p>
                              <p className="text-xs text-[#a1a1aa]">Técnica de Nível 3 - Redes & Segurança</p>
                            </div>
                          </div>
                          
                          <div className="mb-8">
                            <label className="text-[10px] font-black text-[#a1a1aa] uppercase tracking-widest block mb-4">Escolher Avatar</label>
                            <div className="flex flex-wrap gap-3">
                                {avatarOptions.map((url, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setUserAvatar(url)}
                                        className={`w-12 h-12 rounded-xl border-2 transition-all overflow-hidden hover:scale-110 ${userAvatar === url ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-white/10 hover:border-white/30'}`}
                                    >
                                        <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <Input label="E-mail Corporativo" value={user?.email || "paula.admin@techcorp.com"} readOnly />
                            <Input label="ID do Usuário" value={user?.id || ""} readOnly />
                            <Input label="Status de Disponibilidade" value="Disponível para Chamados Críticos" readOnly />
                          </div>
                        </section>
                        
                        <section className="glass p-8 rounded-[32px] border-white/5">
                          <h4 className="text-sm font-black text-white uppercase mb-6 tracking-widest">Notificações</h4>
                          <div className="space-y-4">
                            {[
                              { label: "Alertas de Chamados Críticos", active: true },
                              { label: "Resumo Diário de Atividades", active: true },
                              { label: "Sons de Notificação", active: false }
                            ].map((opt, i) => (
                              <div key={i} className="flex justify-between items-center py-2">
                                <span className="text-xs font-bold text-[#a1a1aa]">{opt.label}</span>
                                <div className={`w-10 h-5 rounded-full p-1 transition-colors ${opt.active ? 'bg-blue-600' : 'bg-white/10'}`}>
                                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${opt.active ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>
            </div>
          </motion.div>
      </AnimatePresence>

      {/* MODAL NOVO CHAMADO */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md"></motion.div>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl glass p-10 rounded-[48px] border-white/10 shadow-3xl">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 text-center">Abrir Novo Chamado</h3>
              <form onSubmit={handleAddTicket} className="space-y-6">
                <Input label="Assunto" value={newTicket.title} onChange={(e) => setNewTicket({...newTicket, title: e.target.value})} placeholder="Descreva brevemente o problema..." required />
                <div className="grid grid-cols-2 gap-4">
                  <Select label="Categoria" value={newTicket.type} onChange={(e) => setNewTicket({...newTicket, type: e.target.value})} options={categories.filter(c => c !== 'Todos')} />
                  <Select label="Prioridade" value={newTicket.priority} onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})} options={['Baixa', 'Média', 'Alta', 'Crítica']} />
                </div>
                <Input label="Solicitante / Setor" value={newTicket.user} onChange={(e) => setNewTicket({...newTicket, user: e.target.value})} placeholder="Ex: Financeiro" required />
                <button type="submit" className="accent-gradient w-full py-4 rounded-2xl text-white font-black uppercase text-sm mt-4 shadow-xl shadow-blue-500/30">Confirmar e Abrir</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL SUCESSO / TICKET DE ATENDIMENTO */}
      <AnimatePresence>
        {isSuccessModalOpen && createdTicket && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSuccessModalOpen(false)} className="absolute inset-0 bg-[#050507]/95 backdrop-blur-2xl"></motion.div>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-white text-[#050507] rounded-[40px] overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)]">
              <div className="bg-[#050507] p-8 text-center">
                <div className="w-16 h-16 rounded-2xl accent-gradient flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-white text-3xl">check_circle</span>
                </div>
                <h3 className="text-white font-black uppercase tracking-tighter text-xl">Ticket Gerado</h3>
                <p className="text-[#94a3b8] text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Protocolo de Atendimento</p>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="flex justify-between border-b border-dashed border-gray-200 pb-4">
                  <span className="text-[10px] font-black uppercase text-gray-400">Número do Ticket</span>
                  <span className="text-sm font-mono font-black text-blue-600">{createdTicket.id}</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase text-gray-400 block">Assunto</label>
                    <p className="text-sm font-bold leading-tight">{createdTicket.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black uppercase text-gray-400 block">Categoria</label>
                      <p className="text-[10px] font-black uppercase">{createdTicket.type}</p>
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-gray-400 block">Prioridade</label>
                      <p className="text-[10px] font-black uppercase text-red-500">{createdTicket.priority}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-gray-400 block">Solicitante</label>
                    <p className="text-sm font-bold">{createdTicket.user}</p>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-gray-400 block">Data/Hora</label>
                    <p className="text-[10px] font-bold">{createdTicket.date}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4">
                   <span className="material-symbols-outlined text-gray-400">qr_code_2</span>
                   <p className="text-[9px] text-gray-500 font-medium leading-tight">Escaneie este código para acompanhar o status em tempo real via mobile.</p>
                </div>
              </div>

              <div className="p-8 pt-0 flex gap-3">
                <button onClick={() => setIsSuccessModalOpen(false)} className="flex-1 bg-[#050507] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">Fechar</button>
                <button onClick={() => window.print()} className="w-14 h-14 border-2 border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#050507] hover:border-[#050507] transition-all">
                  <span className="material-symbols-outlined">print</span>
                </button>
              </div>
              
              <div className="h-2 bg-blue-500"></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DETALHES DO CHAMADO */}
      <AnimatePresence>
        {isDetailModalOpen && selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDetailModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl"></motion.div>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-2xl glass p-10 rounded-[48px] border-white/10 shadow-3xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 accent-gradient"></div>
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-blue-500 font-bold">{selectedTicket.id}</span>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${selectedTicket.priority === 'Crítica' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>{selectedTicket.priority}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter">{selectedTicket.title}</h3>
                </div>
                <button onClick={() => setIsDetailModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-[#a1a1aa] uppercase tracking-widest block mb-1">Status</label>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedTicket.status === 'Cancelado' ? 'bg-red-500' :
                        selectedTicket.status === 'Em Progresso' ? 'bg-blue-500 animate-pulse' :
                        'bg-amber-400'
                      }`}></div>
                      <span className="text-sm font-bold text-white uppercase">{selectedTicket.status}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#a1a1aa] uppercase tracking-widest block mb-1">Solicitante</label>
                    <p className="text-sm font-bold text-white">{selectedTicket.user || '—'}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-[#a1a1aa] uppercase tracking-widest block mb-1">Categoria</label>
                    <p className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-lg border inline-block ${categoryColors[selectedTicket.type] || 'text-white border-white/20 bg-white/5'}`}>{selectedTicket.type}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#a1a1aa] uppercase tracking-widest block mb-1">Data de Abertura</label>
                    <p className="text-sm font-bold text-white">{selectedTicket.date}</p>
                  </div>
                </div>
              </div>

              {selectedTicket.description && (
                <div className="mb-8 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <label className="text-[10px] font-black text-[#a1a1aa] uppercase tracking-widest block mb-2">Descrição / Observações</label>
                  <p className="text-sm text-white/80 leading-relaxed">{selectedTicket.description}</p>
                </div>
              )}

              <div className="space-y-4 border-t border-white/5 pt-8">
                {(selectedTicket.status === 'Aberto' || selectedTicket.status === 'Pendente') ? (
                  <button 
                    onClick={() => handleAssumeTicket(selectedTicket)}
                    disabled={loading}
                    className="accent-gradient w-full py-4 rounded-2xl text-white font-black uppercase text-sm flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">assignment_ind</span> {loading ? 'PROCESSANDO...' : 'ASSUMIR CHAMADO'}
                  </button>
                ) : (
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-green-500">verified</span>
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Chamado em Atendimento por você</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-white/5 w-full py-4 rounded-2xl text-white font-black uppercase text-[10px] flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                    <span className="material-symbols-outlined text-sm">history</span> HISTÓRICO
                  </button>
                  {selectedTicket.status !== 'Cancelado' ? (
                    <button
                      onClick={() => handleCancelTicket(selectedTicket)}
                      disabled={loading}
                      className="bg-red-500/10 w-full py-4 rounded-2xl text-red-500 font-black uppercase text-[10px] flex items-center justify-center gap-3 hover:bg-red-500/20 transition-all disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">cancel</span> {loading ? 'AGUARDE...' : 'CANCELAR'}
                    </button>
                  ) : (
                    <div className="bg-red-500/10 w-full py-4 rounded-2xl flex items-center justify-center gap-3">
                      <span className="material-symbols-outlined text-red-500 text-sm">block</span>
                      <span className="text-red-500 font-black uppercase text-[10px]">Cancelado</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST SUCESSO */}
      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 right-10 z-[100] accent-gradient text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
             <span className="material-symbols-outlined font-bold">check_circle</span>
             <p className="text-[10px] font-black uppercase tracking-widest leading-none">Chamado aberto com sucesso!</p>
          </motion.div>
        )}
      </AnimatePresence>
      {/* TOAST ERRO */}
      <AnimatePresence>
        {authError && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 left-10 z-[100] bg-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
             <span className="material-symbols-outlined font-bold">error</span>
             <p className="text-[10px] font-black uppercase tracking-widest leading-none">{authError}</p>
             <button onClick={() => setAuthError(null)} className="ml-4 hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-sm">close</span>
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// COMPONENTES AUXILIARES
function NavItem({ active, icon, label, onClick }) {
  return (
    <button 
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }} 
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group relative overflow-hidden ${
        active 
          ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
          : 'text-[#94a3b8] hover:bg-white/5 hover:text-white border border-transparent'
      }`}
    >
      <span className="material-symbols-outlined text-[20px] relative z-10">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-widest leading-none relative z-10">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-glow" 
          className="ml-auto w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 transition-all"></div>
    </button>
  )
}

function StatCard({ title, value, icon, color = "text-blue-500" }) {
  return (
    <div className="glass p-6 rounded-[28px] border-white/5 relative overflow-hidden group">
      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color} mb-4 group-hover:scale-110 transition-transform`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <p className="text-[9px] text-[#a1a1aa] uppercase font-black tracking-[0.2em] mb-1">{title}</p>
      <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
    </div>
  )
}

function TicketItem({ id, title, type, priority, status, colorClass, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4 group hover:bg-white/[0.04] hover:border-blue-500/30 transition-all cursor-pointer card-shine"
    >
      <div className={`w-1 h-8 rounded-full ${status === 'Em Atendimento' ? 'bg-blue-500 animate-pulse' : (priority === 'Crítica' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]')}`}></div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[9px] font-black text-[#64748b] uppercase font-mono">{id}</span>
          <span className="w-1 h-1 rounded-full bg-white/10"></span>
          <span className={`text-[9px] font-black uppercase tracking-widest ${colorClass?.split(' ')[0]}`}>{type}</span>
          {status === 'Em Atendimento' && (
            <>
              <span className="w-1 h-1 rounded-full bg-blue-500"></span>
              <span className="text-[8px] font-black text-blue-500 uppercase tracking-tighter animate-pulse">Em Atendimento</span>
            </>
          )}
        </div>
        <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{title}</h4>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-[8px] font-black uppercase px-2 py-1 rounded bg-white/5 ${priority === 'Crítica' ? 'text-red-500' : 'text-[#a1a1aa]'}`}>{priority}</span>
        <span className="material-symbols-outlined text-sm text-[#a1a1aa] opacity-0 group-hover:opacity-100 transition-all">arrow_outward</span>
      </div>
    </div>
  )
}

function HeaderBtn({ icon, badge, onClick }) {
  return (
    <button onClick={onClick} className="w-10 h-10 rounded-xl glass hover:bg-white/10 border-white/10 flex items-center justify-center text-[#a1a1aa] hover:text-white transition-all relative group">
      <span className="material-symbols-outlined text-[20px] group-active:scale-90 transition-transform">{icon}</span>
      {badge && <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full border-2 border-[#050507]"></span>}
    </button>
  )
}

function Input({ label, placeholder, type = "text", value, onChange, required }) {
  return (
    <div className="w-full">
      <label className="text-[10px] font-black text-[#a1a1aa] uppercase tracking-widest mb-2 block">{label}</label>
      <input type={type} value={value} onChange={onChange} required={required} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-blue-500 outline-none transition-all placeholder:text-white/20" placeholder={placeholder} />
    </div>
  )
}

function Select({ label, options, value, onChange }) {
  return (
    <div className="w-full">
      <label className="text-[10px] font-black text-[#a1a1aa] uppercase tracking-widest mb-2 block">{label}</label>
      <select value={value} onChange={onChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
        {options.map(o => <option key={o} value={o} className="bg-[#0a0a0c]">{o}</option>)}
      </select>
    </div>
  )
}

export default App
