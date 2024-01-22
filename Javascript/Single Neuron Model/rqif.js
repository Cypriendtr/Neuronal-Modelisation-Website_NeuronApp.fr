var stim = document.getElementById("Stim").getContext('2d');
var ctx = document.getElementById("Plot").getContext('2d');
ctx.canvas.height=450;
stim.canvas.height=200;

function download(){
  const imageLink = document.createElement('a');
  const canvas = document.getElementById("Plot");
  imageLink.download = 'Plot-RQIF.png';
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

function new_set_intensity(vect,start,end,intensity,noise,dt){
  var arr=ones_like(vect).map(x => x * intensity);
  var len=vect.length;
  for (var i = 0; i <len ;i++) {
    var n = noise*((Math.random()-0.5)*2);
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
/* RQIF function*/
function vdot(v,u,I){
    return (v*v - u + I);
}
function udot(v,u,A,B){
    return (A * (B*v - u));
}

function RQIF(Stim,Vrepos,A,B,C,D,dt){
  let V = [Vrepos];
  let U = [Vrepos * 0.2];
  var len=Stim.length;
  for(var i = 0; i<len-1; i++){
    v_iz = V[i] + (dt * vdot(V[i],U[i],Stim[i]));
    u_iz = U[i] + (dt * udot(V[i], U[i],A,B));
    V.push(v_iz);
    U.push(u_iz);
    if(V[i]>=1){
        V.push(C)
        U.push(U[i]+D)
    }
  }
  return [V,U];
};

function getdata() {
  let dt = document.getElementById("resolgraph").value;

  let noise = Number(document.getElementById("Noisyinput").value)

  let temps_record = Number(document.getElementById("temps_record").value);
  tr=temps_record*1000

  let start =  Number(document.getElementById("Debut stim").value);

  let duration =  Number(document.getElementById("Duree stimulation").value);

  let intensite =  Number(document.getElementById("Intensite").value);

  let Vrepos =  Number(document.getElementById("C").value);

  let A =  Number(document.getElementById("A").value);

  let B =  Number(document.getElementById("B").value);

  let C =  Number(document.getElementById("C").value);

  let D =  Number(document.getElementById("D").value);

  var time = arrange(0,tr,dt);
  var Stim = new_set_intensity(time,start,duration,intensite,noise,dt);

  var V_RQIF= RQIF(Stim,Vrepos,A,B,C,D,dt)[0]

  /*Intplot.data.labels.push(time);
  Intplot.data.datasets.forEach((dataset) => {
    dataset.data.push(Stim);
  });*/

  Intplot.data.labels=time;
  Intplot.data.datasets[0].data=Stim;
  Intplot.update();
  myChart.data.labels=time;
  myChart.data.datasets[0].data=V_RQIF;
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
    labels:[],
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
              text: 'Neuron simulated'},
            },
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