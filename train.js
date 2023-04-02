import { createChart, updateChart } from "./scatterplot.js";

let nn;

//
// load in the csv file
//

const loadData = () => {
  Papa.parse("./data/mobilephones.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => trainModel(results.data),
  });
};

const trainModel = (data) => {
  // sort data and randomize
  data.sort(() => Math.random() - 0.5);

  // make test and training data
  let trainData = data.slice(0, Math.floor(data.length * 0.8));
  let testData = data.slice(Math.floor(data.length * 0.8) + 1);

  const chartdata = data.map((phone) => ({
    x: phone.price,
    y: phone.battery,
  }));

  console.log(chartdata);

  createChart(chartdata, "Price", "Battery");

  let nn = ml5.neuralNetwork({ task: "regression", debug: true });

  // adding data to neural network
  for (let phone of trainData) {
    nn.addData({ battery: phone.battery, resolution: phone.resoloution, rearcam: phone.rearcam, ppi: phone.ppi }, { price: phone.price });
  }

  nn.normalizeData();

  nn.train({ epochs: 30 }, () => finishedTraining(testData, nn));
};

const finishedTraining = (testData, nn) => {
  console.log("finished training");
  makePrediction(testData, nn);
  document.getElementById("save").addEventListener("click", saveModel(nn));
};

const makePrediction = async (testData, nn) => {
  const newPhone = { battery: testData[4].battery, resolution: testData[2].resoloution, rearcam: testData[6].rearcam, ppi: testData[8].ppi };
  const pred = await nn.predict(newPhone);

  console.log(`Geschatte prijs: ${pred[0].price}`);
};

const saveModel = (nn) => {
  nn.save();
};

loadData();
