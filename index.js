import express from "express";
import ejs from "ejs";
import axios from "axios";
import bodyParser from "body-parser";

//Constans and static folder
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(express.urlencoded( { extended:true} ));

//API authentication
const API_URL = "https://v6.exchangerate-api.com/v6/214fa14729521c69a0029933/latest" ;
const API_KEY = "214fa14729521c69a0029933" ;

//currencies
const currencies = ["USD","AED","AFN","ALL","AMD","ANG","AOA","ARS","AUD","AWG","AZN","BAM","BBD","BDT","BGN","BHD","BIF","BMD","BND","BOB","BRL","BSD","BTN","BWP","BYN","BZD","CAD","CDF","CHF","CLP","CNY","COP","CRC","CUP","CVE","CZK","DJF","DKK","DOP","DZD","EGP","ERN","ETB","EUR","FJD","FKP","FOK","GBP","GEL","GGP","GHS","GIP","GMD","GNF","GTQ","GYD","HKD","HNL","HRK","HTG","HUF","IDR","ILS","IMP","INR","IQD","IRR","ISK","JEP","JMD","JOD","JPY","KES","KGS","KHR","KID","KMF","KRW","KWD","KYD","KZT","LAK","LBP","LKR","LRD","LSL","LYD","MAD","MDL","MGA","MKD","MMK","MNT","MOP","MRU","MUR","MVR","MWK","MXN","MYR","MZN","NAD","NGN","NIO","NOK","NPR","NZD","OMR","PAB","PEN","PGK","PHP","PKR","PLN","PYG","QAR","RON","RSD","RUB","RWF","SAR","SBD","SCR","SDG","SEK","SGD","SHP","SLE","SLL","SOS","SRD","SSP","STN","SYP","SZL","THB","TJS","TMT","TND","TOP","TRY","TTD","TVD","TWD","TZS","UAH","UGX","UYU","UZS","VES","VND","VUV","WST","XAF","XCD","XDR","XOF","XPF","YER","ZAR","ZMW","ZWL"];
//sending the currency list to the frontend
app.get("/", (req, res) => {
    res.render("index.ejs", { currencyList : currencies });
});


//teszt
app.post("/chosen-currency", async (req, res) => {
    try{
        const selectedCurrency = req.body.currency;
        const result = await axios.get(API_URL + "/" + selectedCurrency, {
            params: {
                apiKey: API_KEY,
            },
        });
        res.render("result.ejs", {
            currencyList: currencies,
            content: result.data });
        console.log(result);
    } catch(error) {
        res.status(404).send(error.message);
    }
    
});

//a valutaváltó funkció tesztelése

app.post("/valuta-valtas", async (req, res) => {
    try{
        const amount = req.body.amount;
        const currencyOne = req.body["valuta-1"];
        const currencyTwo = req.body["valuta-2"];

        const currencyOneValue = await axios.get(API_URL + "/" + currencyOne, {
            params: {
                apiKey: API_KEY,
            },
        });


        const oneRate = currencyOneValue.data.conversion_rates[currencyTwo];
        const convertedAmount = amount*oneRate;
        
        console.log("Összeg: ", amount, "Váltandó valuta: ", currencyOne, "Váltott valuta: ", currencyTwo, "Váltandó valuta értéke: ", oneRate, "Konvertált összeg: ", convertedAmount)


        res.render("index.ejs", {
            valutaEgy: currencyOne,
            valutaKetto: currencyTwo,
            currencyList: currencies,
            arfolyam: oneRate,
            vegsoOsszeg: convertedAmount,
        });
    } catch(error) {
        res.status(404).send(error.message);
    }
});





//Creating the server 
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});