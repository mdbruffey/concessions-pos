export const products = [
    {
        name: "Hotdog",
        type: "hot",
        default_price: 2,
        image_path: "",
    },
    {
        name: "Mozzarella Sticks",
        type: "hot",
        default_price: 2,
        image_path: "",
    },
    {
        name: "Pretzel with Cheese",
        type: "hot",
        default_price: 2.5,
        image_path: "",
    },
    {
        name: "Pepperoni Slice",
        type: "hot",
        default_price: 2,
        image_path: "",
    },
    {
        name: "Cheese Slice",
        type: "hot",
        default_price: 2,
        image_path: "",
    },
    {
        name: "Pepsi",
        type: "drink",
        default_price: 1,
        image_path: "",
    },
    {
        name: "Sprite",
        type: "drink",
        default_price: 1,
        image_path: "",
    },
    {
        name: "Mug Root Beer",
        type: "drink",
        default_price: 1,
        image_path: "",
    },
    {
        name: "Yellow Gatorade",
        type: "drink",
        default_price: 2,
        image_path: "",
    },
    {
        name: "Red Gatorade",
        type: "drink",
        default_price: 2,
        image_path: "",
    },
    {
        name: "Ice Cream Sandwich",
        type: "frozen",
        default_price: 1,
        image_path: "",
    },
    {
        name: "Ice Cream Cone",
        type: "frozen",
        default_price: 2,
        image_path: "",
    },
    {
        name: "Snickers",
        type: "candy",
        default_price: 2,
        image_path: "",
    },
    {
        name: "3 Musketeers",
        type: "candy",
        default_price: 2,
        image_path: "",
    },
    {
        name: "Skittles",
        type: "candy",
        default_price: 2,
        image_path: "",
    },
];

export const combos = [
    {
        name: "Hotdog Meal Deal",
        default_price: 5,
        items: [
            {
                product: {
                    name: "Hotdog",
                    type: "hot",
                    default_price: 2,
                    image_path: "",
                },
                quantity: 2,
            },
            {
                product: {},
                quantity: 1,
            },
            {
                product: {},
                quantity: 1,
            },
        ],
    },
];
