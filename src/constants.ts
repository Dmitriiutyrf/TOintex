import { FireAlarmObject } from './types';

const defaultHistory = [{ id: '1', date: '2026-03-28', comment: 'Плановое ТО' }];

export const MOCK_OBJECTS: FireAlarmObject[] = [
  // Колесо.ру
  { 
    id: 'koleso-1', 
    customer: 'Колесо.ру (ИП Алексеев С. А.)',
    name: 'Колесо.ру', 
    address: 'ул. 9 Мая, д. 81', 
    status: 'normal', 
    history: defaultHistory,
    contract: '№ АЛ26-2'
  },
  { 
    id: 'koleso-2', 
    customer: 'Колесо.ру (ИП Алексеев С. А.)',
    name: 'Колесо.ру', 
    address: 'ул. Высотная, д. 2, стр. 8', 
    status: 'normal', 
    history: defaultHistory,
    contract: '№ АЛ26-2'
  },
  { 
    id: 'koleso-3', 
    customer: 'Колесо.ру (ИП Алексеев С. А.)',
    name: 'Колесо.ру', 
    address: 'пр-кт им. Газеты «Красноярский рабочий», д. 150, стр. 11', 
    status: 'normal', 
    history: defaultHistory,
    contract: '№ АЛ26-2'
  },
  { 
    id: 'koleso-4', 
    customer: 'Колесо.ру (ИП Алексеев С. А.)',
    name: 'Колесо.ру', 
    address: 'ул. Новосибирская, д. 64', 
    status: 'normal', 
    history: defaultHistory,
    contract: '№ АЛ26-2'
  },
  { 
    id: 'koleso-5', 
    customer: 'Колесо.ру (ИП Алексеев С. А.)',
    name: 'Колесо.ру (Склад)', 
    address: 'ул. Телевизорная, д. 1, стр. 31', 
    status: 'normal', 
    history: defaultHistory,
    contract: '№ АЛ26-2'
  },
  
  // ООО «Ясень»
  {
    id: 'yasen-1',
    customer: 'ООО «Ясень»',
    name: 'ООО «Ясень»',
    address: 'г. Красноярск, ул. Ястынская, 6а',
    status: 'normal',
    history: defaultHistory,
    contract: 'с ООО «Спектр»',
    notes: 'ТО-1 (ежемесячно): проверка приборов, шлейфов и визуальный осмотр.\nТО-2 (раз в квартал): полная проверка работоспособности, переключение на резервное питание и проверка систем дымоудаления.'
  },

  // ООО «Малтат»
  {
    id: 'maltat-1',
    customer: 'ООО «Малтат»',
    name: 'АБК',
    address: 'Красноярский край, п. Приморск',
    status: 'normal',
    history: defaultHistory
  },
  {
    id: 'maltat-2',
    customer: 'ООО «Малтат»',
    name: 'Насосная станция',
    address: 'Красноярский край, п. Приморск',
    status: 'normal',
    history: defaultHistory
  },
  {
    id: 'maltat-3',
    customer: 'ООО «Малтат»',
    name: 'Трансформаторная подстанция с дизельной',
    address: 'Красноярский край, п. Приморск',
    status: 'normal',
    history: defaultHistory
  },
  {
    id: 'maltat-4',
    customer: 'ООО «Малтат»',
    name: 'Ремонтная мастерская / Столярка',
    address: 'Красноярский край, п. Приморск',
    status: 'normal',
    history: defaultHistory
  },
  {
    id: 'maltat-5',
    customer: 'ООО «Малтат»',
    name: 'Гостиница АБК',
    address: 'Красноярский край, п. Приморск',
    status: 'normal',
    history: defaultHistory
  },
  {
    id: 'maltat-6',
    customer: 'ООО «Малтат»',
    name: 'Автомобильный стояночный бокс',
    address: 'Красноярский край, п. Приморск',
    status: 'normal',
    history: defaultHistory
  },

  // ООО «Хладагент-К»
  {
    id: 'hladagent-1',
    customer: 'ООО «Хладагент-К»',
    name: 'ООО «Хладагент-К»',
    address: 'г. Красноярск (объекты согласно внутреннему перечню)',
    status: 'normal',
    history: defaultHistory,
    notes: 'Периодичность: Ежемесячно'
  },

  // Прочие контрагенты (Объекты в Красноярске)
  {
    id: 'other-1',
    customer: 'Прочие контрагенты',
    name: 'ИП Михоношина А. И. (Абаза)',
    address: 'Объекты Заказчика (г. Красноярск)',
    status: 'normal',
    history: defaultHistory,
    notes: 'Периодичность: Ежемесячно'
  },
  {
    id: 'other-2',
    customer: 'Прочие контрагенты',
    name: 'ООО ПК «РУССТРОЙ» (Махаон)',
    address: 'Объекты Заказчика (г. Красноярск)',
    status: 'normal',
    history: defaultHistory,
    notes: 'Периодичность: Ежемесячно'
  },
  {
    id: 'other-3',
    customer: 'Прочие контрагенты',
    name: 'ООО «Феникс»',
    address: 'Объекты Заказчика (г. Красноярск)',
    status: 'normal',
    history: defaultHistory,
    notes: 'Периодичность: Ежемесячно'
  },
  {
    id: 'other-4',
    customer: 'Прочие контрагенты',
    name: 'ОО ПК «НПО СКРУТКА»',
    address: 'Объекты Заказчика (г. Красноярск)',
    status: 'normal',
    history: defaultHistory,
    notes: 'Периодичность: Ежемесячно'
  },
  {
    id: 'other-5',
    customer: 'Прочие контрагенты',
    name: 'ИП Фомина Е. С. (объекты «Караоке» и другие)',
    address: 'Объекты Заказчика (г. Красноярск)',
    status: 'normal',
    history: defaultHistory,
    notes: 'Периодичность: Ежемесячно'
  }
];
