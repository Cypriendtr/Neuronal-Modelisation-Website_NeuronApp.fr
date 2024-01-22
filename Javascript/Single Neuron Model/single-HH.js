var stim = document.getElementById("Stim").getContext('2d');
var ctx = document.getElementById("Plot").getContext('2d');
ctx.canvas.height=450;
stim.canvas.height=200;
function download(){
  const imageLink = document.createElement('a');
  const canvas = document.getElementById("Plot");
  imageLink.download = 'Plot-HH.png';
  imageLink.href = canvas.toDataURL('image/png',1);
  imageLink.click();
}

function linspace(startValue, stopValue, cardinality) {
  var arr = [];
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(startValue + (step * i));
  }
  return arr;
};
function arrange(startValue,stopValue,step) {
  var arr = [];
  for (var i = 0; i*step < stopValue;i++) {
    arr.push(startValue + (step*i));
  }
  return arr;
}
function ones_like(vect) {
  var arr = [];
  var len=vect.length;
  for (var i = 0; i<len;i++) {
    arr.push(1);
  }
  return arr;
};
function set_intensity(vect,start,end,intensity,noise) {
  var arr=[];
  var len=vect.length;
  var n = noise* ((1 +1) + -1)
  for (var i = 0; i <len ;i++) {
    if (i<start){
      arr.push(0+Math.random()*n)
    }
    else if(i>(start+end)){
      arr.push(0 + Math.random()*n)
    }
    else {arr.push(intensity+Math.random()*n)};
  }
  return arr;
};
function new_set_intensity(vect,start,end,intensity,noise,dt){
  var arr=ones_like(vect).map(x => x * intensity);
  var len=vect.length;
  for (var i = 0; i <len ;i++) {
    var n = noise* ((Math.random()-0.5)*2);
    arr[i+1]=(arr[i] + dt*n/10);
    if (i<(start/dt)){
      arr[i]=0
    }
    else if(i>((start+end)/dt)){
      arr[i]=0
    };
  }
  return arr
};

function alpha_n(V){
    return 0.002 * (V - 25) / (1 - Math.exp((-V + 25) / 9))};

function beta_n(V){
    return -0.0002 * (V - 25) / (1 - Math.exp((V - 25 ) / 9))};

function alpha_m(V){
    return 0.0182 * (V - (-35)) / (1 - Math.exp((- V + (-35)) / 9))};
    
function beta_m(V){
    return -0.0124 * (V - (-35)) / (1 - Math.exp((V - (-35)) / 9))};

function alpha_H(V){
    return 0.025 * Math.exp((-V - 90) / 12)};

function beta_H(V){
    return 0.025 * (Math.exp((V + 62) / 6))/(1 + Math.exp((V + 90) / 12))}



function HH(dT,I,V_0,n,h,m,g0_k,g0_na,gL,C,E_na,E_K,E_L){
    var dt=dT;
    var len = I.length;
    let V = [V_0];
    let N = [n];
    let M = [m];
    let H = [h];
    for(var i = 0; i<len-1; i++){
        V.push(V[i] + dt * (I[i]- (g0_k * N[i]**4 * (V[i] - E_K) + g0_na * H[i] * M[i]**3 * (V[i] - E_na) + gL * (V[i] - E_L)) / C));
        N.push(N[i] + dt * (alpha_n(V[i]) * (1 - N[i]) - beta_n(V[i]) * N[i]));
        H.push(H[i] + dt * (alpha_H(V[i]) * (1 - H[i]) - beta_H(V[i]) * H[i]));
        M.push(M[i] + dt * (alpha_m(V[i]) * (1 - M[i]) - beta_m(V[i]) * M[i]));}

    return [V,N,H,M]
};


function getdata() {
  let dt = (document.getElementById("resolgraph").value/500);
  

  let noise = Number(document.getElementById("Noisyinput").value)

  let temps_record = Number(document.getElementById("temps_record").value);
  tr=temps_record*1000

  let start =  Number(document.getElementById("Debut stim").value);

  let duration =  Number(document.getElementById("Duree stimulation").value);

  let intensite =  Number(document.getElementById("Intensite").value);

  let g0_k =  Number(document.getElementById("g0_k").value);

  let g0_na =  Number(document.getElementById("g0_na").value);

  let gL =  Number(document.getElementById("gL").value);

  let C =  Number(document.getElementById("C").value);

  let V_0 = Number(document.getElementById("V_0").value);

  let n =  Number(document.getElementById("n").value);

  let m =  Number(document.getElementById("m").value);

  let h =  Number(document.getElementById("h").value);

  let E_K =  Number(document.getElementById("E_K").value);

  let E_na =  Number(document.getElementById("E_na").value);

  let E_L =  Number(document.getElementById("E_L").value);

  var time = arrange(0,tr,dt);

  var Stim = new_set_intensity(time,start,duration,intensite,noise,dt);

  var VHH = HH(dt,Stim,V_0,n,h,m,g0_k,g0_na,gL,C,E_na,E_K,E_L)[0];


  Intplot.data.labels=time;
  Intplot.data.datasets[0].data=Stim;
  Intplot.update();
  myChart.data.labels=time;
  myChart.data.datasets[0].data=VHH;
  myChart.update();
}

var Intplot = new Chart(stim,{
  type: 'line',
  data:{
    labels: [],
    datasets:[{
      label:[],
      data:[],
      backgroundColor: [
        'black'
      ],
      borderColor: [
        'black'
      ],
      borderWidth: 2
    }]
  },
  options:{   
     plugins: {
    title: {
        font:{size:18},
        display: true,
        text: 'Stimulation'}},
  elements:{
    point:{pointRadius:0}},
  scales: {
    y: {
      title:{
        display: true,
        text:"Intensity in mV"}
    },
  x:{
    title:{
      display: true,
      text:"Time in ms"}
  }}}
})





var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
      datasets: [{
          label: [],
          data: [],
          backgroundColor: [
            'black'
          ],
          borderColor: [
            'black'
          ],
          borderWidth: 2
        }]
      },
      options: {
        plugins: {
          title: {
              font:{size:18},
              display: true,
              text: 'Neuron HH simulated'}},
        elements:{
          point:{pointRadius:0}},
        scales: {
          y: {
            title:{
              display: true,
              text:"Potential in mV"}
          },
        x:{
          title:{
            display: true,
            text:"Time in ms"}
        }
        }
      }
    });
