var stim = document.getElementById("Stim").getContext('2d');
var ctx = document.getElementById("Plot").getContext('2d');
ctx.canvas.height=450;
stim.canvas.height=200;
function download(){
  const imageLink = document.createElement('a');
  const canvas = document.getElementById("Plot");
  imageLink.download = 'Plot-LIF.png';
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
}

function lif(Stim,Vspike,Vthr,Vrepos,Vreset,Rmemb,tau,dt){
  let v = ones_like(Stim);
  let V = v.map(x => x * Vrepos);
  let dv;
  var len=V.length;
  for(var i = 0; i<len-1; i++){
    dv = (dt)*((-(V[i] - Vrepos) + Rmemb *Stim[i])/tau);
    V[i+1]=V[i] + dv;

    if(V[i]>Vthr){
      V[i+1] = Vspike
    };
    if(V[i] == Vspike){
      V[i+1] = Vreset
    };
  }
  return V;
};

function getdata() {
  let dt = document.getElementById("resolgraph").value;

  let noise = Number(document.getElementById("Noisyinput").value)

  let temps_record = Number(document.getElementById("temps_record").value);
  tr=temps_record*1000

  let start =  Number(document.getElementById("Debut stim").value);

  let duration =  Number(document.getElementById("Duree stimulation").value);

  let intensite =  Number(document.getElementById("Intensite").value);

  let Vspike =  Number(document.getElementById("Vspike").value);

  let Vthr =  Number(document.getElementById("Vthr").value);

  let Vrepos =  Number(document.getElementById("Vrepos").value);

  let Rmemb =  Number(document.getElementById("Rmemb").value);

  let Vreset = Number(document.getElementById("Vreset").value);

  let tau =  Number(document.getElementById("csttemps").value);

  var time = arrange(0,tr,dt);
  var Stim = new_set_intensity(time,start,duration,intensite,noise,dt);

  var Vlif = lif(Stim,Vspike,Vthr,Vrepos,Vreset,Rmemb,tau,dt)



  Intplot.data.labels=time;
  Intplot.data.datasets[0].data=Stim;
  Intplot.update();
  myChart.data.labels=time;
  myChart.data.datasets[0].data=Vlif;
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
              text: 'Neuron simulated'}},
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
