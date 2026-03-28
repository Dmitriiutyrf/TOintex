import React, { useState, useMemo } from 'react';
import { ShieldCheck, Activity, AlertTriangle, Home, List, User, ChevronRight, ChevronDown, Bell, Plus, MessageSquare, Calendar, Clock, LogOut, Phone, KeyRound } from 'lucide-react';
import { motion } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { MOCK_OBJECTS } from './constants';
import { FireAlarmObject, MaintenanceRecord } from './types';
import { TelegramLogin, TelegramUser } from './components/TelegramLogin';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [botName, setBotName] = useState('samplebot'); // Placeholder bot name
  
  // Phone auth state
  const [loginMethod, setLoginMethod] = useState<'telegram' | 'phone'>('telegram');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const [objects, setObjects] = useState<FireAlarmObject[]>(MOCK_OBJECTS);
  const [activeObjectId, setActiveObjectId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [expandedCustomers, setExpandedCustomers] = useState<string[]>([]);

  const activeObject = objects.find(o => o.id === activeObjectId);
  const customers = Array.from(new Set<string>(objects.map(o => o.customer)));

  const getMaintenanceStatus = (history: MaintenanceRecord[]) => {
    if (history.length === 0) return { status: 'unknown', text: 'Нет данных о ТО', days: 0 };
    
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastRecord = sortedHistory[0];
    
    const lastDate = new Date(lastRecord.date);
    const today = new Date();
    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 30) {
      return { status: 'overdue', text: `Просрочено на ${diffDays - 30} дн.`, days: diffDays, lastDate: lastRecord.date };
    }
    
    return { status: 'ok', text: `ТО: ${diffDays} дн. назад`, days: diffDays, lastDate: lastRecord.date };
  };

  const overdueObjects = useMemo(() => {
    return objects.filter(o => getMaintenanceStatus(o.history).status === 'overdue');
  }, [objects]);

  const toggleCustomer = (customer: string) => {
    setExpandedCustomers(prev => 
      prev.includes(customer) ? prev.filter(c => c !== customer) : [...prev, customer]
    );
  };

  const addRecord = () => {
    if (!activeObject || !newComment) return;
    const newRecord: MaintenanceRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      comment: newComment
    };
    setObjects(prev => prev.map(o => o.id === activeObject.id ? { ...o, history: [...o.history, newRecord] } : o));
    setNewComment('');
    toast.success('Запись добавлена!');
  };

  const handleSendCode = () => {
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      toast.error('Введите корректный номер телефона');
      return;
    }
    setIsCodeSent(true);
    toast.success('Код отправлен! (Для теста введите 0000)');
  };

  const handleVerifyCode = () => {
    if (smsCode === '0000') {
      setUser({
        id: Date.now(),
        first_name: 'Пользователь',
        username: phoneNumber,
        auth_date: Date.now() / 1000,
        hash: 'phone_auth'
      });
      setIsAuthenticated(true);
      toast.success('Успешный вход');
    } else {
      toast.error('Неверный код. Введите 0000');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg text-text font-sans flex items-center justify-center p-4 relative overflow-hidden">
        <Toaster theme="dark" position="top-center" />
        <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-3xl w-full max-w-md flex flex-col items-center text-center relative z-10"
        >
          <div className="bg-accent/20 p-4 rounded-2xl mb-6">
            <ShieldCheck className="w-12 h-12 text-accent" />
          </div>
          <h1 className="text-3xl font-bold gradient-text tracking-tight mb-2">ИНТЕКС-СБ</h1>
          <p className="text-muted mb-6">Система управления техническим обслуживанием</p>
          
          <div className="flex bg-black/20 p-1 rounded-xl w-full mb-6 border border-white/5">
            <button 
              onClick={() => setLoginMethod('telegram')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${loginMethod === 'telegram' ? 'bg-white/10 text-white' : 'text-muted hover:text-white'}`}
            >
              <MessageSquare className="w-4 h-4" /> Telegram
            </button>
            <button 
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${loginMethod === 'phone' ? 'bg-white/10 text-white' : 'text-muted hover:text-white'}`}
            >
              <Phone className="w-4 h-4" /> Телефон
            </button>
          </div>

          {loginMethod === 'telegram' ? (
            <div className="w-full bg-black/20 p-4 rounded-2xl mb-6 border border-white/5">
              <p className="text-xs text-muted mb-3 text-left">
                Для реального входа укажите юзернейм вашего Telegram-бота (без @). 
                Бот должен быть привязан к этому домену через @BotFather (/setdomain).
              </p>
              <input 
                type="text" 
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="Например: intex_sb_bot"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white mb-4 focus:outline-none focus:border-accent"
              />
              
              {botName ? (
                <div className="bg-white rounded-xl p-1 overflow-hidden flex justify-center">
                  <TelegramLogin 
                    botName={botName}
                    onAuth={(tgUser) => {
                      setUser(tgUser);
                      setIsAuthenticated(true);
                      toast.success(`Добро пожаловать, ${tgUser.first_name}!`);
                    }}
                  />
                </div>
              ) : (
                <p className="text-xs text-accent">Введите имя бота для отображения виджета</p>
              )}
            </div>
          ) : (
            <div className="w-full bg-black/20 p-4 rounded-2xl mb-6 border border-white/5">
              {!isCodeSent ? (
                <>
                  <p className="text-xs text-muted mb-3 text-left">
                    Введите номер телефона для получения SMS-кода.
                  </p>
                  <div className="relative mb-4">
                    <Phone className="w-5 h-5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="tel" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+7 (999) 000-00-00"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:border-accent"
                    />
                  </div>
                  <button
                    onClick={handleSendCode}
                    className="w-full bg-accent hover:bg-accent/80 transition-colors text-white p-3 rounded-xl font-bold"
                  >
                    Получить код
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs text-muted mb-3 text-left">
                    Код отправлен на номер {phoneNumber}
                  </p>
                  <div className="relative mb-4">
                    <KeyRound className="w-5 h-5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value)}
                      placeholder="Введите код (0000)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:border-accent text-center tracking-widest"
                      maxLength={4}
                    />
                  </div>
                  <button
                    onClick={handleVerifyCode}
                    className="w-full bg-accent hover:bg-accent/80 transition-colors text-white p-3 rounded-xl font-bold mb-3"
                  >
                    Подтвердить
                  </button>
                  <button
                    onClick={() => {
                      setIsCodeSent(false);
                      setSmsCode('');
                    }}
                    className="w-full text-xs text-muted hover:text-white transition-colors"
                  >
                    Изменить номер
                  </button>
                </>
              )}
            </div>
          )}

          <div className="w-full flex items-center gap-4 mb-6">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-xs text-muted font-medium uppercase">или</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <button
            onClick={() => {
              setUser({
                id: 123456789,
                first_name: 'Демо',
                last_name: 'Пользователь',
                username: 'demo_user',
                auth_date: Date.now() / 1000,
                hash: 'demo'
              });
              setIsAuthenticated(true);
              toast.success('Успешный вход в демо-режиме');
            }}
            className="w-full bg-white/5 hover:bg-white/10 transition-colors text-white p-4 rounded-xl font-bold flex items-center justify-center gap-3 border border-white/10"
          >
            Войти в демо-режим
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text font-sans pb-20 relative overflow-hidden">
      <Toaster theme="dark" position="top-center" />
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full pointer-events-none" />
      
      <nav className="glass px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-accent/20 p-2 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-xl font-bold gradient-text tracking-tight">ИНТЕКС-СБ</h1>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <User className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">{user.first_name}</span>
            </div>
          )}
          <button 
            onClick={() => {
              setIsAuthenticated(false);
              setUser(null);
            }}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-muted hover:text-white"
            title="Выйти"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="p-4 max-w-7xl mx-auto">
        {!activeObjectId ? (
          <>
            <header className="mb-6">
              <h2 className="text-3xl font-bold gradient-text tracking-tight">Объекты</h2>
            </header>

            {overdueObjects.length > 0 && (
              <div className="mb-6 bg-accent/10 border border-accent/20 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-accent">Внимание: Просрочено ТО</h3>
                  <p className="text-xs text-accent/80 mt-1">
                    Объектов с просроченным обслуживанием (более 30 дней): {overdueObjects.length}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {customers.map((customer) => {
                const customerObjs = objects.filter(o => o.customer === customer);
                const isExpanded = expandedCustomers.includes(customer);
                const customerOverdueCount = customerObjs.filter(o => getMaintenanceStatus(o.history).status === 'overdue').length;

                return (
                  <section key={customer} className="glass rounded-3xl overflow-hidden">
                    <div 
                      onClick={() => toggleCustomer(customer)}
                      className="bg-white/5 p-4 flex justify-between items-center cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-sm text-accent">{customer}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted bg-black/20 px-2 py-1 rounded-full">{customerObjs.length}</span>
                          {customerOverdueCount > 0 && (
                            <span className="text-xs text-white bg-accent px-2 py-1 rounded-full flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> {customerOverdueCount}
                            </span>
                          )}
                        </div>
                      </div>
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-muted" /> : <ChevronRight className="w-5 h-5 text-muted" />}
                    </div>
                    {isExpanded && (
                      <div className="divide-y divide-white/5 border-t border-white/5 bg-black/20">
                        {customerObjs.map((obj) => {
                          const mntStatus = getMaintenanceStatus(obj.history);
                          return (
                            <div key={obj.id} onClick={() => setActiveObjectId(obj.id)} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                              <div>
                                <h4 className="font-medium text-sm">{obj.name}</h4>
                                <p className="text-xs text-muted mt-1">{obj.address}</p>
                                {mntStatus.status !== 'unknown' && (
                                  <div className={`mt-2 text-[10px] font-medium inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
                                    mntStatus.status === 'overdue' ? 'bg-accent/20 text-accent' : 'bg-green-500/10 text-green-400'
                                  }`}>
                                    <Clock className="w-3 h-3" />
                                    {mntStatus.text}
                                  </div>
                                )}
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted" />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </>
        ) : (
          <section className="glass rounded-3xl p-5">
            <button onClick={() => setActiveObjectId(null)} className="text-xs text-muted mb-4 flex items-center gap-1">← Назад к объектам</button>
            <h2 className="text-2xl font-bold mb-1">{activeObject.name}</h2>
            <p className="text-sm text-muted mb-2">{activeObject.address}</p>
            {activeObject.contract && (
              <p className="text-xs text-accent mb-6">Договор: {activeObject.contract}</p>
            )}
            
            {activeObject.notes && (
              <div className="bg-accent/10 border border-accent/20 p-3 rounded-xl mb-6">
                <h4 className="text-xs font-bold text-accent mb-1">Регламент обслуживания:</h4>
                <p className="text-xs text-muted whitespace-pre-wrap">{activeObject.notes}</p>
              </div>
            )}

            <h3 className="font-bold text-lg mb-4">История обслуживания</h3>
            <div className="space-y-3 mb-6">
              {activeObject.history.map(record => (
                <div key={record.id} className="bg-white/5 p-3 rounded-xl">
                  <p className="text-xs text-muted mb-1">{record.date}</p>
                  <p className="text-sm">{record.comment}</p>
                </div>
              ))}
              {activeObject.history.length === 0 && (
                <p className="text-sm text-muted text-center py-4">История пуста</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                placeholder="Новая запись..." 
                className="bg-white/5 text-sm p-3 rounded-xl"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={addRecord} className="bg-accent text-white p-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Добавить запись
              </button>
              <button 
                onClick={() => {
                  const contractText = activeObject.contract ? `\nДоговор: ${activeObject.contract}` : '';
                  const text = encodeURIComponent(`Техническое обслуживание выполнено.
Заказчик: ${activeObject.customer}
Объект: ${activeObject.name}
Адрес: ${activeObject.address}${contractText}

Комментарий: ${newComment || 'Без комментариев'}

Можно выставлять счет.`);
                  window.open(`tg://msg?to=+79131991000&text=${text}`);
                }}
                className="bg-indigo-500 hover:bg-indigo-400 transition-colors text-white p-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Выставить счет
              </button>
            </div>
          </section>
        )}
      </main>

      <nav className="fixed bottom-4 left-4 right-4 glass rounded-3xl flex justify-around items-center p-3 z-10">
        {[
          { icon: Home, label: 'Главная', active: false },
          { icon: List, label: 'Объекты', active: true },
          { icon: User, label: 'Профиль', active: false },
        ].map((item, i) => (
          <button key={i} className={`flex flex-col items-center gap-1 p-2 ${item.active ? 'text-accent' : 'text-muted'}`}>
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
