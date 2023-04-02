nn = ml5.neuralNetwork({ task: "regression", debug: true });
nn.load("./model/model.json", () => modelLoaded());

const modelLoaded = () => {
  console.log("the model has been loaded");
  document.getElementById("btn").addEventListener("click", () => makePrediction());
};

const makePrediction = async () => {
  let battery = parseInt(document.getElementById("battery").value);
  let rearcam = parseInt(document.getElementById("rearcam").value);
  let resolution = parseInt(document.getElementById("resolution").value);
  let ppi = parseInt(document.getElementById("ppi").value);
  let result = document.getElementById("result");

  const phone = { battery: battery, resolution: resolution, rearcam: rearcam, ppi: ppi };
  console.log(phone);
  const pred = await nn.predict(phone);

  const price = pred[0].price;
  const fmt = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" });
  const fixedPrice = fmt.format(price);

  result.innerHTML = `The price of your phone is ${fixedPrice}`;
};
