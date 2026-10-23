/* DBC · camada de dados compartilhada entre os apps (v1 e v2) e o painel.
 *
 * Nesta fase os dados ficam no armazenamento local do navegador (localStorage),
 * então painel e app só "conversam" quando abertos no mesmo navegador do mesmo aparelho.
 *
 * Para trocar por Firebase depois: reescreva só o objeto `adapter` abaixo
 * (load/save usando o Firestore) e chame `notify()` quando os dados mudarem
 * no servidor. Os apps e o painel usam apenas as funções de `DBCStore`.
 */
(function(){
  var SEED = {"cats": [{"id": "solda", "name": "Soldagem"}, {"id": "gas", "name": "Gases"}, {"id": "eletricas", "name": "Elétricas"}, {"id": "fixacao", "name": "Parafusos e rebites"}, {"id": "abrasivos", "name": "Discos"}, {"id": "epi", "name": "EPI"}, {"id": "ferragens", "name": "Ferragens"}, {"id": "manuais", "name": "Manuais"}], "products": [{"active": true, "top": true, "gas": false, "tag": "", "id": "inv160", "cat": "solda", "sub": "Máquinas", "name": "Inversora de solda MMA 160 A bivolt", "brand": "Linha profissional", "sku": "SD-160MMA", "unit": "un", "stock": 6, "vars": [{"l": "160 A", "p": 689.9}, {"l": "200 A", "p": 899, "s": "até eletrodo 4,0 mm"}], "specs": [["Corrente", "20 a 160 A"], ["Tensão", "127 / 220 V automático"], ["Eletrodo", "até 3,25 mm"], ["Ciclo de trabalho", "60% a 160 A"], ["Garantia", "12 meses"]]}, {"active": true, "top": false, "gas": false, "tag": "", "id": "mig200", "cat": "solda", "sub": "Máquinas", "name": "Máquina MIG/MAG 200 A com e sem gás", "brand": "Linha profissional", "sku": "SD-MIG200", "unit": "un", "stock": 3, "vars": [{"l": "200 A", "p": 2390}], "specs": [["Arame", "0,6 a 1,0 mm"], ["Tensão", "220 V"], ["Modo", "MIG, MAG, arame tubular e eletrodo"], ["Garantia", "12 meses"]]}, {"active": true, "top": true, "gas": false, "tag": "", "id": "e6013", "cat": "solda", "sub": "Consumíveis", "name": "Eletrodo revestido E6013", "brand": "Consumível", "sku": "EL-6013", "unit": "kg", "stock": 180, "vars": [{"l": "2,5 mm", "p": 32.9}, {"l": "3,25 mm", "p": 31.5}, {"l": "4,0 mm", "p": 30.9}], "specs": [["Norma", "AWS A5.1 E6013"], ["Posição", "todas"], ["Corrente", "CA ou CC"], ["Venda", "por kg (lata de 5 kg ou avulso)"]]}, {"active": true, "top": false, "gas": false, "tag": "", "id": "er70", "cat": "solda", "sub": "Consumíveis", "name": "Arame MIG ER70S-6 cobreado, rolo 15 kg", "brand": "Consumível", "sku": "AR-ER70S6", "unit": "rolo", "stock": 22, "vars": [{"l": "0,8 mm", "p": 389}, {"l": "1,0 mm", "p": 379}], "specs": [["Norma", "AWS A5.18 ER70S-6"], ["Gás indicado", "Ar/CO₂ (C25) ou CO₂"], ["Peso", "15 kg"]]}, {"active": true, "top": true, "gas": true, "tag": "Recarga", "id": "c25", "cat": "gas", "sub": "Gás para MIG", "name": "Gás Ar/CO₂ C25 para solda MIG, cilindro 10 m³", "brand": "Gás industrial", "sku": "GS-C25-10", "unit": "cilindro", "stock": 14, "vars": [{"l": "Recarga", "s": "troca pelo seu casco", "p": 289}, {"l": "Cilindro novo + gás", "s": "cilindro de aço próprio", "p": 1890}], "specs": [["Mistura", "75% argônio + 25% CO₂"], ["Volume", "10 m³ (≈ 9 kg)"], ["Válvula", "padrão CGA 580"], ["Transporte", "somente caminhonete, em pé e amarrado"]]}, {"active": true, "top": false, "gas": true, "tag": "", "id": "o2", "cat": "gas", "sub": "Oxicorte", "name": "Oxigênio industrial, cilindro 10 m³", "brand": "Gás industrial", "sku": "GS-O2-10", "unit": "cilindro", "stock": 9, "vars": [{"l": "Recarga", "s": "troca do casco", "p": 159}, {"l": "Cilindro novo + gás", "p": 1490}], "specs": [["Pureza", "99,5%"], ["Volume", "10 m³"], ["Transporte", "somente caminhonete"]]}, {"active": true, "top": true, "gas": false, "tag": "10x sem juros", "id": "df333", "cat": "eletricas", "sub": "Parafusadeiras", "name": "Parafusadeira e furadeira Makita 12 V DF333DWYE", "brand": "Makita", "sku": "MK-DF333", "unit": "un", "stock": 5, "vars": [{"l": "2 baterias + maleta", "p": 899}], "specs": [["Bateria", "12 V Li-ion, 1,5 Ah (2 un)"], ["Torque", "30 N·m"], ["Mandril", "3/8\" (10 mm)"], ["Garantia", "12 meses Makita"]]}, {"active": true, "top": false, "gas": false, "tag": "", "id": "ga4530", "cat": "eletricas", "sub": "Esmerilhadeiras", "name": "Esmerilhadeira angular Makita 4.1/2\" 720 W GA4530", "brand": "Makita", "sku": "MK-GA4530", "unit": "un", "stock": 8, "vars": [{"l": "127 V", "p": 349}, {"l": "220 V", "p": 349}], "specs": [["Disco", "4.1/2\" (115 mm)"], ["Potência", "720 W"], ["Rotação", "11.000 rpm"]]}, {"active": true, "top": false, "gas": false, "tag": "", "id": "fur650", "cat": "eletricas", "sub": "Furadeiras", "name": "Furadeira de impacto 1/2\" 650 W", "brand": "Linha profissional", "sku": "FD-650", "unit": "un", "stock": 11, "vars": [{"l": "127 V", "p": 289}, {"l": "220 V", "p": 289}], "specs": [["Mandril", "1/2\" (13 mm)"], ["Potência", "650 W"], ["Impacto", "até 48.000 ipm"]]}, {"active": true, "top": true, "gas": false, "tag": "", "id": "m8", "cat": "fixacao", "sub": "Parafusos", "name": "Parafuso sextavado M8 zincado com porca", "brand": "Fixação", "sku": "PF-M8-ZN", "unit": "cento", "stock": 60, "vars": [{"l": "M8 x 20", "p": 22.9}, {"l": "M8 x 30", "p": 24.9}, {"l": "M8 x 50", "p": 31.9}], "specs": [["Rosca", "métrica grossa 1,25"], ["Classe", "8.8"], ["Acabamento", "zincado branco"], ["Venda", "cento (100 un)"]]}, {"active": true, "top": false, "gas": false, "tag": "", "id": "rebite", "cat": "fixacao", "sub": "Rebites", "name": "Rebite POP alumínio 4,0 x 12 mm, caixa 500", "brand": "Fixação", "sku": "RB-4012", "unit": "caixa", "stock": 35, "vars": [{"l": "4,0 x 12", "p": 39.9}, {"l": "4,8 x 16", "p": 54.9}], "specs": [["Corpo", "alumínio"], ["Haste", "aço"], ["Quantidade", "500 un"]]}, {"active": true, "top": false, "gas": false, "tag": "", "id": "prego", "cat": "fixacao", "sub": "Pregos", "name": "Prego com cabeça 17x27", "brand": "Fixação", "sku": "PR-1727", "unit": "kg", "stock": 300, "vars": [{"l": "17x27", "p": 18.9}, {"l": "18x30", "p": 18.5}], "specs": [["Bitola", "17 (3,0 mm)"], ["Comprimento", "27 linhas (62 mm)"], ["Venda", "por kg"]]}, {"active": true, "top": true, "gas": false, "tag": "Leve 25", "id": "disco", "cat": "abrasivos", "sub": "Discos de corte", "name": "Disco de corte inox 4.1/2\" x 1,0 mm", "brand": "Abrasivo", "sku": "DC-115-10", "unit": "un", "stock": 400, "vars": [{"l": "Unidade", "p": 4.9}, {"l": "Pacote com 25", "s": "R$ 4,36 cada", "p": 109}], "specs": [["Diâmetro", "115 mm"], ["Espessura", "1,0 mm"], ["Furo", "22,23 mm"], ["Rotação máx.", "13.300 rpm"]]}, {"active": true, "top": false, "gas": false, "tag": "", "id": "mascara", "cat": "epi", "sub": "Proteção facial", "name": "Máscara de solda automática tonalidade 9–13", "brand": "EPI", "sku": "EP-MSA913", "unit": "un", "stock": 12, "vars": [{"l": "Padrão", "p": 189}], "specs": [["Escurecimento", "1/25.000 s"], ["Tonalidade", "DIN 9 a 13"], ["CA", "com certificado de aprovação"]]}, {"active": true, "top": false, "gas": false, "tag": "", "id": "luva", "cat": "epi", "sub": "Luvas", "name": "Luva de raspa cano longo para soldador", "brand": "EPI", "sku": "EP-LRCL", "unit": "par", "stock": 80, "vars": [{"l": "Tamanho único", "p": 21.9}], "specs": [["Material", "raspa de couro"], ["Cano", "longo (34 cm)"]]}, {"active": true, "top": false, "gas": false, "tag": "", "id": "dobradica", "cat": "ferragens", "sub": "Dobradiças", "name": "Dobradiça para portão soldável 3\"", "brand": "Ferragem", "sku": "FG-DOB3", "unit": "par", "stock": 40, "vars": [{"l": "3\"", "p": 16.9}, {"l": "4\"", "p": 22.9}], "specs": [["Material", "aço carbono"], ["Uso", "portões e grades"]]}, {"active": true, "top": false, "gas": false, "tag": "", "id": "chave", "cat": "manuais", "sub": "Chaves", "name": "Jogo de chaves combinadas 6 a 22 mm, 12 peças", "brand": "Ferramenta manual", "sku": "FM-CC12", "unit": "jogo", "stock": 7, "vars": [{"l": "12 peças", "p": 149}], "specs": [["Material", "cromo-vanádio"], ["Medidas", "6 a 22 mm"]]}], "orders": [{"no": "4821", "items": [["e6013", 0, 5], ["disco", 1, 1], ["m8", 1, 2]], "ship": "moto", "pay": "pix", "doc": "cpf", "customer": "Marcos Silva", "status": 3, "historyOffsetsMin": [36, 34, 17, 0]}, {"no": "4710", "items": [["c25", 0, 1], ["er70", 0, 1], ["luva", 0, 2]], "ship": "truck", "pay": "card", "doc": "cnpj", "customer": "Serralheria Silva", "status": 4, "historyOffsetsMin": [21000, 20999, 20430, 19555, 19450]}, {"no": "4655", "items": [["m8", 0, 3], ["rebite", 0, 2], ["prego", 0, 5], ["disco", 0, 10], ["dobradica", 1, 2]], "ship": "pickup", "pay": "boleto", "doc": "cnpj", "customer": "Serralheria Silva", "status": 4, "historyOffsetsMin": [34000, 32600, 32550, 32545, 32280]}]};
  var KEY_P = 'dbc.products.v1', KEY_O = 'dbc.orders.v1', KEY_N = 'dbc.lastOrderNo.v1', KEY_I = 'dbc.invoices.v1', KEY_R = 'dbc.returns.v1', KEY_S = 'dbc.settings.v1', KEY_E = 'dbc.events.v1';

  var adapter = {
    name: 'local',
    load: function(key){ try{ var v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }catch(e){ return null; } },
    save: function(key, value){ try{ localStorage.setItem(key, JSON.stringify(value)); return true; }catch(e){ return false; } }
  };

  // ---------- sincronização entre aparelhos (Firebase) ----------
  // Enquanto FIREBASE for null, tudo fica só neste navegador. Para sincronizar painel, apps de venda e entregador
  // entre celulares diferentes, cole aqui a configuração do app web do Firebase (Console > Configurações do projeto).
  var FIREBASE = null;
  var SYNC_KEYS = [KEY_P, KEY_O, KEY_N, KEY_N + '.nf', KEY_I, KEY_R, KEY_S, KEY_E];
  var remote = null, synced = {}, sync = { mode: FIREBASE ? 'firebase' : 'local', on: false, error: null };
  var localSave = adapter.save;
  function docId(k){ return k.replace(/\./g, '_'); }
  adapter.save = function(key, value){
    var ok = localSave(key, value);
    // Só envia depois de receber a versão da nuvem, para um aparelho novo não apagar os dados com os de exemplo.
    if(remote && synced[key] && SYNC_KEYS.indexOf(key) >= 0)
      remote.doc(docId(key)).set({ v: JSON.stringify(value), t: Date.now() }).catch(function(e){ sync.error = String(e && e.message || e); notify(); });
    return ok;
  };
  function loadScript(src){ return new Promise(function(res, rej){ var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
  function startSync(){
    if(!FIREBASE) return;
    var base = 'https://www.gstatic.com/firebasejs/10.12.5/';
    (window.firebase ? Promise.resolve() : loadScript(base + 'firebase-app-compat.js').then(function(){ return loadScript(base + 'firebase-firestore-compat.js'); }))
    .then(function(){
      if(!firebase.apps.length) firebase.initializeApp(FIREBASE);
      remote = firebase.firestore().collection('dbc');
      SYNC_KEYS.forEach(function(k){
        remote.doc(docId(k)).onSnapshot(function(snap){
          var loc = null; try{ loc = localStorage.getItem(k); }catch(e){}
          if(!snap.exists){ synced[k] = true; if(loc != null) remote.doc(docId(k)).set({ v: loc, t: Date.now() }); return; }
          synced[k] = true; var v = snap.data().v;
          if(v !== loc){ try{ localStorage.setItem(k, v); }catch(e){} notify(); }
        }, function(e){ sync.error = String(e && e.message || e); notify(); });
      });
      sync.on = true; sync.error = null; notify();
    }).catch(function(e){ sync.error = 'Não foi possível conectar ao Firebase'; notify(); });
  }

  var listeners = [];
  function notify(){ listeners.forEach(function(cb){ try{ cb(); }catch(e){} }); }
  window.addEventListener('storage', function(e){ if(!e.key || e.key.indexOf('dbc.') === 0) notify(); });

  function clone(x){ return JSON.parse(JSON.stringify(x)); }
  function now(){ var d = new Date(); return d.toISOString(); }

  // ---------- produtos ----------
  function allProducts(){ var p = adapter.load(KEY_P); if(!p){ p = clone(SEED.products); adapter.save(KEY_P, p); } return p; }
  function products(){ return allProducts().filter(function(p){ return p.active !== false && p.vars && p.vars.length; }); }
  function saveProduct(prod){
    var list = allProducts(), i = list.findIndex(function(p){ return p.id === prod.id; });
    if(!prod.id) prod.id = 'p' + Date.now().toString(36);
    if(i >= 0) list[i] = prod; else list.unshift(prod);
    var ok = adapter.save(KEY_P, list); notify(); return ok;
  }
  function deleteProduct(id){ adapter.save(KEY_P, allProducts().filter(function(p){ return p.id !== id; })); notify(); }

  // ---------- pedidos ----------
  // status: 0 recebido, 1 pago, 2 separado, 3 saiu para entrega / pronto para retirada, 4 entregue / retirado, -1 cancelado
  var STEPS = {
    delivery: ['Pedido recebido','Pagamento aprovado','Separado no estoque','Saiu para entrega','Entregue'],
    pickup:   ['Pedido recebido','Pagamento aprovado','Separado no estoque','Pronto para retirada','Retirado na loja']
  };
  function stepNames(o){ return o.ship === 'pickup' ? STEPS.pickup : STEPS.delivery; }
  function statusLabel(o){
    if(o.status === -1) return 'Cancelado';
    if(o.status === 0) return o.pay === 'card' ? 'Recebido' : 'Aguardando pagamento';
    return ['Recebido','Pago','Separado', o.ship === 'pickup' ? 'Pronto para retirar' : 'A caminho', o.ship === 'pickup' ? 'Retirado' : 'Entregue'][o.status];
  }
  function fmt(iso){ var d = new Date(iso); return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+' · '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2); }
  function steps(o){
    var names = stepNames(o);
    return names.map(function(n, i){
      var t = o.history && o.history[i];
      var done = o.status !== -1 && (i < o.status || (i === o.status && i === 4) || (i === 0 && o.status >= 0));
      var cur = o.status !== -1 && i === o.status && i !== 4 && i !== 0;
      return [n, t ? fmt(t) : (o.status === -1 ? '' : 'Aguardando'), done ? 1 : (cur ? 'now' : 0)];
    });
  }
  function seedOrders(){
    var base = Date.now();
    return SEED.orders.map(function(o){ var c = clone(o); c.history = o.historyOffsetsMin.map(function(m){ return m === null ? null : new Date(base - m*60000).toISOString(); }); c.created = c.history[0]; delete c.historyOffsetsMin; c.items = c.items.map(snap); return c; });
  }
  function orders(){ var o = adapter.load(KEY_O); if(!o){ o = seedOrders(); adapter.save(KEY_O, o); } return o.slice().sort(function(a,b){ return (b.created||'').localeCompare(a.created||''); }); }
  function order(no){ return orders().find(function(o){ return o.no === String(no); }); }
  function saveOrders(list){ adapter.save(KEY_O, list); notify(); }
  function createOrder(data){
    var list = adapter.load(KEY_O) || seedOrders();
    var last = adapter.load(KEY_N) || 4821; var no = String(last + 1); adapter.save(KEY_N, last + 1);
    var o = { no: no, created: now(), items: data.items.map(snap), ship: data.ship, pay: data.pay, doc: data.doc || 'cpf', customer: data.customer || 'Marcos Silva', status: 0, history: [now()], code: String(1000 + Math.floor(Math.random() * 9000)), by: { 0: data.by || 'app' } };
    if(data.addr) o.addr = data.addr; if(data.phone) o.phone = data.phone;
    if(data.paid) { o.status = 1; o.history[1] = now(); o.by[1] = data.by === 'loja' ? 'loja' : 'automático'; }
    logEvent({ type: 'order', orderNo: o.no, status: o.status, by: o.by[0], customer: o.customer, text: 'Novo pedido' + (o.status >= 1 ? ' pago' : '') });
    list.push(o); saveOrders(list); if(o.status >= 1) ensureSaleInvoice(o); return o;
  }
  function setStatus(no, status, by){
    var list = adapter.load(KEY_O) || seedOrders(), o = list.find(function(x){ return x.no === String(no); });
    if(!o) return;
    o.status = status; o.history = o.history || []; o.by = o.by || {}; o.by[status] = by || 'loja';
    if(status >= 0){ for(var i = 0; i <= status; i++){ if(!o.history[i]) o.history[i] = now(); } o.history.length = status + 1; }
    logEvent({ type: 'status', orderNo: o.no, status: status, by: by || 'loja', customer: o.customer, text: stepText(o, status) });
    saveOrders(list);
    if(status >= 1) ensureSaleInvoice(o);
    if(status === -1) invoicesFor(o.no).forEach(function(n){ if(n.type === 'venda' && n.status !== 'cancelada') setInvoiceStatus(n.id, n.status === 'emitida' ? 'cancelada' : 'cancelada'); });
  }


  // ---------- avisos (o que aconteceu, para o painel) ----------
  function events(){ return (adapter.load(KEY_E) || []).slice().reverse(); }
  function logEvent(e){
    var l = adapter.load(KEY_E) || []; e.id = 'e' + Date.now().toString(36) + Math.floor(Math.random() * 1000); e.t = now(); l.push(e);
    if(l.length > 150) l = l.slice(-150); adapter.save(KEY_E, l);
  }
  function stepText(o, st){ return st === -1 ? 'Cancelado' : stepNames(o)[st]; }

  // ---------- entrega ----------
  // Código de 4 dígitos que o cliente informa ao entregador para confirmar a entrega.
  function deliveryCode(o){ if(!o) return ''; if(o.code) return o.code; if(o.no === '4821') return '7314'; var h = 0; String(o.no).split('').forEach(function(c){ h = (h * 31 + c.charCodeAt(0)) % 9000; }); return String(1000 + h); }
  function addrOf(o){ return (o && o.addr) || 'Rua das Indústrias, 450, galpão 3 · Distrito Industrial, Piedade - SP'; }
  function phoneOf(o){ return (o && o.phone) || '(15) 98765-4321'; }
  // proof: { name: quem recebeu, photo: dataURL opcional, cascos: cascos vazios recolhidos, note }
  function confirmDelivery(no, code, by, proof){
    var o = order(no); if(!o || o.status !== 3 || String(code).trim() !== deliveryCode(o)) return false;
    if(proof){ var list = adapter.load(KEY_O), x = list.find(function(y){ return y.no === o.no; }); x.proof = { name: proof.name || '', photo: proof.photo || null, cascos: proof.cascos || 0, note: proof.note || '', t: now(), by: by || 'entregador' }; adapter.save(KEY_O, list); }
    setStatus(no, 4, by || 'entregador'); return true;
  }
  // Cascos vazios a recolher: itens de gás na opção "Recarga" (troca do cilindro).
  function cascosFor(o){ return (o && o.items || []).reduce(function(a, it){ var p = findProduct(it[0]); return a + (p && p.gas && it[1] === 0 ? it[2] : 0); }, 0); }
  var ISSUES = ['Cliente ausente', 'Endereço não encontrado', 'Cliente recusou', 'Produto avariado', 'Outro motivo'];
  // Entrega não realizada: o pedido volta para "pronto para sair" e a loja recebe o aviso.
  function deliveryIssue(no, reason, note, by){
    var list = adapter.load(KEY_O) || seedOrders(), o = list.find(function(x){ return x.no === String(no); }); if(!o) return;
    o.issues = o.issues || []; o.issues.push({ t: now(), reason: reason, note: note || '', by: by || 'entregador' });
    o.status = 2; o.history.length = 3; o.by = o.by || {};
    logEvent({ type: 'issue', orderNo: o.no, status: 2, by: by || 'entregador', customer: o.customer, text: 'Não entregue: ' + reason + (note ? ' (' + note + ')' : '') });
    saveOrders(list);
  }

  // ---------- preços e totais ----------
  function findProduct(id){ return allProducts().find(function(p){ return p.id === id; }) || SEED.products.find(function(p){ return p.id === id; }); }
  function priceOf(id, v){ var p = findProduct(id); if(!p) return 0; var x = p.vars[v] || p.vars[0]; return x ? x.p : 0; }
  function snap(it){ return it.length > 3 ? it : [it[0], it[1], it[2], priceOf(it[0], it[1])]; }
  var SHIP_FEE = { moto: 14.90, truck: 39.90, pickup: 0 };
  function itemPrice(it){ return it[3] != null ? it[3] : priceOf(it[0], it[1]); }
  function totals(o){
    var sub = o.items.reduce(function(a, it){ return a + itemPrice(it) * it[2]; }, 0);
    var shipFee = SHIP_FEE[o.ship] || 0, disc = o.pay === 'pix' ? sub * 0.05 : 0;
    return { sub: r2(sub), fee: shipFee, disc: r2(disc), total: r2(sub + shipFee - disc) };
  }
  function r2(n){ return Math.round(n * 100) / 100; }

  // ---------- configurações (taxas estimadas do meio de pagamento) ----------
  var DEFAULT_SETTINGS = { courierPin: '1234', fees: { pix: { pct: 0.99, fixed: 0 }, card: { pct: 4.98, fixed: 0 }, boleto: { pct: 0, fixed: 3.49 } } };
  function settings(){ var s = adapter.load(KEY_S); return s || clone(DEFAULT_SETTINGS); }
  function saveSettings(s){ adapter.save(KEY_S, s); notify(); }
  function fee(pay, amount){ var f = settings().fees[pay] || { pct: 0, fixed: 0 }; return r2(amount * (f.pct || 0) / 100 + (f.fixed || 0)); }

  // ---------- notas fiscais (simuladas nesta fase) ----------
  // A emissão real virá do emissor de NF-e por API. Aqui só guardamos os dados e os arquivos anexados.
  function rnd(n){ var s = ''; while(s.length < n) s += Math.floor(Math.random() * 10); return s; }
  function invoicesRaw(){ var l = adapter.load(KEY_I); if(!l){ l = seedInvoices(); adapter.save(KEY_I, l); } return l; }
  function seedInvoices(){
    var list = [], num = 1200;
    (adapter.load(KEY_O) || seedOrders()).forEach(function(o){
      if(o.status < 1) return;
      var inv = newInvoice(o, 'venda', totals(o).total);
      if(o.status >= 1){ num++; inv.status = 'emitida'; inv.number = num; inv.issued = o.history[1] || o.created; inv.key = '3526' + rnd(40); }
      list.push(inv);
    });
    adapter.save(KEY_N + '.nf', num);
    return list;
  }
  function newInvoice(o, type, amount, ret){
    return { id: 'nf' + Date.now().toString(36) + Math.floor(Math.random() * 1000), type: type, orderNo: o.no, returnId: ret || null, customer: o.customer || 'Cliente', doc: o.doc || 'cpf',
      amount: r2(amount), status: 'pendente', number: null, series: 1, created: now(), issued: null, key: null, files: {} };
  }
  function invoices(){ return invoicesRaw().slice().sort(function(a, b){ return (b.created || '').localeCompare(a.created || ''); }); }
  function invoicesFor(no){ return invoices().filter(function(n){ return n.orderNo === String(no); }); }
  function saveInvoices(l){ if(!adapter.save(KEY_I, l)) return false; notify(); return true; }
  function ensureSaleInvoice(o){
    var l = invoicesRaw(); if(l.some(function(n){ return n.orderNo === o.no && n.type === 'venda'; })) return;
    var n = newInvoice(o, 'venda', totals(o).total); l.push(n); saveInvoices(l);
    if(settings().autoInvoice !== false) emitInvoice(n.id); // emissão automática ao confirmar o pagamento
  }
  function emitInvoice(id){
    var l = invoicesRaw(), n = l.find(function(x){ return x.id === id; }); if(!n || n.status !== 'pendente') return;
    var num = (adapter.load(KEY_N + '.nf') || 1200) + 1; adapter.save(KEY_N + '.nf', num);
    n.status = 'emitida'; n.number = num; n.issued = now(); n.key = '3526' + rnd(40); saveInvoices(l);
  }
  function setInvoiceStatus(id, st){ var l = invoicesRaw(), n = l.find(function(x){ return x.id === id; }); if(!n) return; n.status = st; if(st === 'cancelada') n.cancelled = now(); saveInvoices(l); }
  function attachInvoiceFile(id, kind, name, dataUrl){ var l = invoicesRaw(), n = l.find(function(x){ return x.id === id; }); if(!n) return false; n.files = n.files || {}; n.files[kind] = { name: name, data: dataUrl }; return saveInvoices(l); }
  function invoiceXML(n){
    var o = order(n.orderNo) || { items: [] };
    var items = (n.type === 'devolucao' ? ((returns().find(function(r){ return r.id === n.returnId; }) || {}).items || []) : o.items);
    return '<?xml version="1.0" encoding="UTF-8"?>\n<!-- SIMULAÇÃO: arquivo de teste gerado pelo painel DBC, sem valor fiscal. A NF-e real vem do emissor. -->\n' +
      '<nfeSimulada versao="teste">\n  <ide><nNF>' + (n.number || '') + '</nNF><serie>' + n.series + '</serie><dhEmi>' + (n.issued || '') + '</dhEmi><finNFe>' + (n.type === 'devolucao' ? '4' : '1') + '</finNFe><natOp>' + (n.type === 'devolucao' ? 'Devolução de venda' : 'Venda de mercadoria') + '</natOp></ide>\n' +
      '  <emit><xNome>DBC Gases e Locações</xNome><xLgr>Rua Vinte de Maio, 320</xLgr><xMun>Piedade</xMun><UF>SP</UF><CEP>18170000</CEP><fone>1533442737</fone></emit>\n' +
      '  <dest><xNome>' + n.customer + '</xNome><tipoDoc>' + n.doc.toUpperCase() + '</tipoDoc></dest>\n' +
      items.map(function(it, i){ var p = findProduct(it[0]) || { name: it[0], sku: '', unit: 'un' }; return '  <det nItem="' + (i + 1) + '"><cProd>' + (p.sku || '') + '</cProd><xProd>' + p.name + '</xProd><uCom>' + p.unit + '</uCom><qCom>' + it[2] + '</qCom><vUnCom>' + itemPrice(it).toFixed(2) + '</vUnCom></det>\n'; }).join('') +
      '  <total><vNF>' + n.amount.toFixed(2) + '</vNF></total>\n  <chave>' + (n.key || '') + '</chave>\n  <pedido>' + n.orderNo + '</pedido>\n</nfeSimulada>\n';
  }

  // ---------- devoluções ----------
  var RETURN_STATUS = { solicitada: 'Solicitada', aprovada: 'Aprovada', recebida: 'Produto recebido', reembolsada: 'Reembolsada', recusada: 'Recusada' };
  function returnsRaw(){ return adapter.load(KEY_R) || []; }
  function returns(){ return returnsRaw().slice().sort(function(a, b){ return (b.created || '').localeCompare(a.created || ''); }); }
  function returnsFor(no){ return returns().filter(function(r){ return r.orderNo === String(no); }); }
  function createReturn(data){
    var o = order(data.orderNo); if(!o) return null;
    var l = returnsRaw(), id = 'D' + String(l.length + 1).padStart(3, '0');
    var items = data.items.filter(function(it){ return it[2] > 0; }).map(function(it){ return [it[0], it[1], it[2], it[3] != null ? it[3] : priceOf(it[0], it[1])]; });
    var r = { id: id, orderNo: o.no, customer: o.customer, created: now(), reason: data.reason, note: data.note || '', items: items, amount: r2(data.amount),
      refund: data.refund || o.pay, restock: !!data.restock, restocked: false, status: 'solicitada', history: { solicitada: now() } };
    l.push(r); adapter.save(KEY_R, l); logEvent({ type: 'return', orderNo: o.no, by: data.by || 'loja', customer: o.customer, text: 'Devolução ' + r.id + ' registrada' });
    var inv = invoicesRaw(); inv.push(newInvoice(o, 'devolucao', r.amount, r.id)); adapter.save(KEY_I, inv);
    notify(); return r;
  }
  function setReturnStatus(id, st){
    var l = returnsRaw(), r = l.find(function(x){ return x.id === id; }); if(!r) return;
    r.status = st; r.history = r.history || {}; r.history[st] = now();
    if(st === 'reembolsada' && !r.history.aprovada) r.history.aprovada = now();
    if((st === 'recebida' || st === 'reembolsada') && r.restock && !r.restocked){
      var prods = allProducts(); r.items.forEach(function(it){ var p = prods.find(function(x){ return x.id === it[0]; }); if(p) p.stock = (p.stock || 0) + it[2]; });
      adapter.save(KEY_P, prods); r.restocked = true;
    }
    adapter.save(KEY_R, l);
    if(st === 'recusada'){ var inv = invoicesRaw(); inv.forEach(function(n){ if(n.returnId === r.id && n.status === 'pendente') n.status = 'cancelada'; }); adapter.save(KEY_I, inv); }
    notify();
  }

  // ---------- planilha CSV ----------
  var COLS = ['id','codigo','nome','categoria','subcategoria','marca','unidade','estoque','ativo','destaque','gas','etiqueta','opcoes','ficha'];
  function esc(v){ v = v == null ? '' : String(v); return /[";\n]/.test(v) ? '"' + v.replace(/"/g,'""') + '"' : v; }
  function toCSV(){
    var rows = [COLS.join(';')];
    allProducts().forEach(function(p){
      rows.push([p.id, p.sku, p.name, p.cat, p.sub, p.brand, p.unit, p.stock, p.active !== false ? 'sim':'não', p.top ? 'sim':'não', p.gas ? 'sim':'não', p.tag || '',
        p.vars.map(function(v){ return v.l + '=' + String(v.p).replace('.',',') + (v.s ? ' (' + v.s + ')' : ''); }).join(' | '),
        (p.specs||[]).map(function(s){ return s[0] + ': ' + s[1]; }).join(' | ')].map(esc).join(';'));
    });
    return '﻿' + rows.join('\n');
  }
  function parseCSV(text){
    text = text.replace(/^﻿/, ''); var sep = text.split('\n')[0].indexOf(';') >= 0 ? ';' : ',';
    var out = [], row = [], cell = '', q = false;
    for(var i = 0; i < text.length; i++){
      var ch = text[i];
      if(q){ if(ch === '"'){ if(text[i+1] === '"'){ cell += '"'; i++; } else q = false; } else cell += ch; }
      else if(ch === '"') q = true;
      else if(ch === sep){ row.push(cell); cell = ''; }
      else if(ch === '\n' || ch === '\r'){ if(ch === '\r' && text[i+1] === '\n') i++; row.push(cell); out.push(row); row = []; cell = ''; }
      else cell += ch;
    }
    if(cell || row.length){ row.push(cell); out.push(row); }
    return out.filter(function(r){ return r.some(function(c){ return c.trim(); }); });
  }
  function yes(v){ return /^(s|sim|1|x|true|y)/i.test(String(v||'').trim()); }
  function fromCSV(text){
    var rows = parseCSV(text); if(rows.length < 2) throw new Error('A planilha está vazia.');
    var head = rows[0].map(function(h){ return h.trim().toLowerCase(); });
    var col = function(r, name){ var i = head.indexOf(name); return i >= 0 ? (r[i] || '').trim() : ''; };
    var list = allProducts(), added = 0, updated = 0, errors = [];
    rows.slice(1).forEach(function(r, n){
      var name = col(r,'nome'); if(!name){ errors.push('Linha ' + (n+2) + ': sem nome'); return; }
      var vars = col(r,'opcoes').split('|').map(function(x){
        x = x.trim(); if(!x) return null; var m = x.match(/^(.*?)=\s*([\d.,]+)\s*(?:\((.*)\))?$/);
        if(!m) return null; var v = { l: m[1].trim() || 'Padrão', p: parseFloat(m[2].replace(/\./g,'').replace(',','.')) }; if(m[3]) v.s = m[3]; return v;
      }).filter(Boolean);
      if(!vars.length){ errors.push('Linha ' + (n+2) + ': preço inválido em "opcoes"'); return; }
      var id = col(r,'id'), cat = col(r,'categoria');
      if(!SEED.cats.some(function(c){ return c.id === cat; })) cat = 'ferragens';
      var p = { id: id || ('p' + Date.now().toString(36) + n), sku: col(r,'codigo'), name: name, cat: cat, sub: col(r,'subcategoria') || 'Geral', brand: col(r,'marca') || 'DBC',
        unit: col(r,'unidade') || 'un', stock: parseInt(col(r,'estoque'),10) || 0, active: col(r,'ativo') ? yes(col(r,'ativo')) : true, top: yes(col(r,'destaque')), gas: yes(col(r,'gas')),
        tag: col(r,'etiqueta'), vars: vars, specs: col(r,'ficha').split('|').map(function(x){ var i = x.indexOf(':'); return i > 0 ? [x.slice(0,i).trim(), x.slice(i+1).trim()] : null; }).filter(Boolean) };
      var i = list.findIndex(function(x){ return x.id === p.id || (p.sku && x.sku === p.sku); });
      if(i >= 0){ p.id = list[i].id; p.photo = list[i].photo; list[i] = p; updated++; } else { list.push(p); added++; }
    });
    adapter.save(KEY_P, list); notify();
    return { added: added, updated: updated, errors: errors };
  }

  function reset(){ adapter.save(KEY_P, clone(SEED.products)); adapter.save(KEY_O, seedOrders()); adapter.save(KEY_N, 4821); adapter.save(KEY_I, null); adapter.save(KEY_R, null); adapter.save(KEY_S, null); adapter.save(KEY_E, null); notify(); }
  function checkCourierPin(pin){ return String(pin).trim() === String(settings().courierPin || '1234'); }

  window.DBCStore = {
    adapter: adapter.name, cats: SEED.cats,
    products: products, allProducts: allProducts, saveProduct: saveProduct, deleteProduct: deleteProduct,
    orders: orders, order: order, createOrder: createOrder, setStatus: setStatus, deliveryCode: deliveryCode, cascosFor: cascosFor, deliveryIssue: deliveryIssue, ISSUES: ISSUES, addrOf: addrOf, phoneOf: phoneOf, confirmDelivery: confirmDelivery, steps: steps, statusLabel: statusLabel,
    toCSV: toCSV, fromCSV: fromCSV, reset: reset,
    totals: totals, priceOf: priceOf,
    invoices: invoices, invoicesFor: invoicesFor, emitInvoice: emitInvoice, setInvoiceStatus: setInvoiceStatus, attachInvoiceFile: attachInvoiceFile, invoiceXML: invoiceXML,
    returns: returns, returnsFor: returnsFor, createReturn: createReturn, setReturnStatus: setReturnStatus, RETURN_STATUS: RETURN_STATUS,
    settings: settings, saveSettings: saveSettings, fee: fee,
    events: events, checkCourierPin: checkCourierPin, syncStatus: function(){ return { mode: sync.mode, on: sync.on, error: sync.error }; },
    onChange: function(cb){ listeners.push(cb); }
  };
  startSync();
})();
