// The demo and editable sample use the same calculation as the real planner.
let sampleMode=false;
const readValues=()=>Object.fromEntries(['cash','food','transport','needs','buffer'].map(id=>[id,num(id)]).concat([['nextPay',$('nextPay').value]]));
const signal=name=>document.dispatchEvent(new CustomEvent('aipayer:event',{detail:name}));
function scenario(){
  const now=new Date();
  const ds=n=>{const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+n);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  return {values:{cash:850,food:120,transport:0,needs:0,buffer:0,nextPay:ds(7)},bills:[
    {id:'demo-rent',name:'Rent',amount:600,due:ds(1),priority:'essential',balance:0,apr:0},
    {id:'demo-electric',name:'Electricity',amount:140,due:ds(3),priority:'essential',balance:0,apr:0},
    {id:'demo-card',name:'Card minimum',amount:75,due:ds(5),priority:'debt',balance:0,apr:0}
  ]};
}
function revealPlanner(){document.querySelectorAll('.entry').forEach(el=>el.hidden=false);}
function ownPlan(){
  if(sampleMode){bills=ownBills;renderBills();['cash','nextPay','food','transport','needs','buffer'].forEach(id=>$(id).value='');}
  sampleMode=false;$('planSection').hidden=true;$('intro').hidden=false;$('intro').focus();
  signal('own_plan_started');
}
let ownBills=bills;
['cash','nextPay'].forEach(id=>$('moneyStart').append($(id).parentElement));
document.querySelectorAll('.own').forEach(el=>el.addEventListener('click',ownPlan));
$('continue').addEventListener('click',()=>{
  if(!$('cash').value||!$('nextPay').value||!$('cash').reportValidity()||!$('nextPay').reportValidity()){$('introError').textContent='Enter your available money and next income date.';return;}
  $('introError').textContent='';revealPlanner();$('billsSection').focus();
});
$('sample').addEventListener('click',()=>{
  if(!sampleMode)ownBills=bills;
  const s=scenario();sampleMode=true;bills=s.bills;renderBills();Object.entries(s.values).forEach(([id,value])=>$(id).value=value);
  $('intro').hidden=false;revealPlanner();$('intro').focus();signal('sample_started');
});
// Sample edits stay in memory; never replace previously saved personal bills.
const saveOwn=save;
save=function(){if(sampleMode)renderBills();else saveOwn();};
document.addEventListener('aipayer:event',e=>{if(e.detail==='plan_generated'||e.detail==='sample_plan_generated')document.querySelectorAll('.after-plan').forEach(el=>el.hidden=false);});
