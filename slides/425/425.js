const customers = [
  "1f46e.svg",
  "1f64b.svg",
  "1f64d-200d-2642-fe0f.svg",
  "1f64e.svg",
  "1f468-200d-1f3a4.svg",
  "1f468-200d-1f3a8.svg",
  "1f468-200d-1f3eb.svg",
  "1f468-200d-1f3ed.svg",
  "1f468-200d-1f4bb.svg",
  "1f468-200d-1f4bc.svg",
  "1f468-200d-1f33e.svg",
  "1f468-200d-1f52c.svg",
  "1f468-200d-1f373.svg",
  "1f468-200d-1f393.svg",
  "1f468-200d-1f692.svg",
  "1f468-200d-2695-fe0f.svg",
  "1f468-200d-2696-fe0f.svg",
  "1f468-200d-2708-fe0f.svg",
  "1f469-200d-1f3a4.svg",
  "1f469-200d-1f3a8.svg",
  "1f469-200d-1f3eb.svg",
  "1f469-200d-1f3ed.svg",
  "1f469-200d-1f4bb.svg",
  "1f469-200d-1f4bc.svg",
  "1f469-200d-1f33e.svg",
  "1f469-200d-1f52c.svg",
  "1f469-200d-1f373.svg",
  "1f469-200d-1f393.svg",
  "1f469-200d-1f527.svg",
  "1f469-200d-1f680.svg",
  "1f469-200d-1f692.svg",
  "1f469-200d-2695-fe0f.svg",
  "1f469-200d-2696-fe0f.svg",
  "1f469-200d-2708-fe0f.svg",
  "1f470.svg",
  "1f471-200d-2642-fe0f.svg",
  "1f473-200d-2642-fe0f.svg",
  "1f477-200d-2640-fe0f.svg",
  "1f482.svg",
  "1f575-fe0f-200d-2640-fe0f.svg"
];

const groups = [
  {
    name: "blue",
    hex: "#0067B9",
    stock: 5,
    x: 40,
    y: 133,
    shirts: []
  },
  {
    name: "grey",
    hex: "#4B4F54",
    stock: 5,
    x: 1304,
    y: 133,
    shirts: []
  },
  {
    name: "lightblu",
    hex: "#2495BF",
    stock: 5,
    x: 40,
    y: 394,
    shirts: []
  },
  {
    name: "green",
    hex: "#7ABC31",
    stock: 5,
    x: 1304,
    y: 394,
    shirts: []
  },
  {
    name: "red",
    hex: "#DE4F3F",
    stock: 5,
    x: 40,
    y: 659,
    shirts: []
  },
  {
    name: "yellow",
    hex: "#F0BD53",
    stock: 5,
    x: 1304,
    y: 659,
    shirts: []
  }
];

const template = document.querySelector("#ss-demo");
const stockContainer = document.querySelector("#stock");
const customerContainer = document.querySelector("#customers");

const init = () => {
  groups.forEach(group => {
    const { hex, stock, x, y } = group;
    for (i = 0; i < stock; i++) {
      const shirt = template.cloneNode(true);
      shirt.setAttribute("fill", hex);
      shirt.setAttribute("data-stock", i);
      shirt.setAttribute("x", x);
      shirt.setAttribute("y", y + i * 25);
      group.shirts.push(shirt);
      stockContainer.appendChild(shirt);
    }
  });
};

const resetGroup = group => {
  group.shirts.forEach((shirt, i) => {
    const offset = groups.indexOf(group) % 2 === 0 ? -300 : 300;
    shirt.classList.add("notransition");
    shirt.setAttribute("x", group.x + offset);
    shirt.setAttribute("y", group.y + i * 25);
  });
  setTimeout(() => {
    group.shirts.forEach((shirt, i) => {
      shirt.classList.remove("notransition");
      shirt.setAttribute("x", group.x);
      shirt.setAttribute("y", group.y + i * 25);
    });
    group.stock = 5;
  }, 1500);
};

const getRandomGroup = () => {
  const group = groups[Math.floor(Math.random() * groups.length)];
  if (group.stock > 0) return group;
  return getRandomGroup();
};

const addCustomer = customer => {
  customerContainer.appendChild(customer);
  TweenMax.to(customer, 0, {
    attr: {
      x: "50%",
      y: "100%"
    },
    onComplete: () => showCustomer(customer)
  });
};

const showCustomer = customer => {
  TweenMax.to(customer, 0.5, {
    attr: { y: "70.5%" },
    onComplete: () => sellShirt(customer)
  });
};

const sellShirt = customer => {
  const group = getRandomGroup();
  const shirt = group.shirts[group.stock - 1];
  group.stock -= 1;
  TweenMax.to(shirt, 0.5, {
    attr: { x: 740, y: 720 },
    onComplete: () => onSaleComplete(group, shirt, customer)
  });
};

const onSaleComplete = (group, shirt, customer) => {
  TweenMax.to(shirt, 0.5, {
    y: 500,
    onComplete: () => readyShirt(group, shirt)
  });
  TweenMax.to(customer, 0.5, {
    y: 500,
    onComplete: () => removeCustomer(customer)
  });
};

const removeCustomer = customer => customer.parentNode.removeChild(customer);

const readyShirt = (group, shirt) => {
  const index = group.shirts.indexOf(shirt);
  const offset = groups.indexOf(group) % 2 === 0 ? -400 : 400;
  TweenMax.to(shirt, 0, {
    attr: {
      x: group.x,
      y: group.y + index * 25
    },
    y: 0,
    x: offset
  });

  if (group.stock === 0) {
    group.shirts.forEach((shirt, index) => {
      TweenMax.to(shirt, 0.25, {
        delay: index * 0.01,
        x: 0,
        onComplete: () => {
          if (index === 4) {
            group.stock = 5;
          }
        }
      });
    });
  }
};

const sellItem = () => {
  const customer = customers[Math.floor(Math.random() * customers.length)];
  const customerTag = template.cloneNode(true);
  customerTag.setAttribute("href", `busts/${customer}#customer`);
  customerTag.setAttribute("width", 200);
  customerTag.id = "";

  addCustomer(customerTag);
};

window.interval = setInterval(sellItem, 1500);

init();
