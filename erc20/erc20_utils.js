const config = require('./erc20_config.json');
const Web3 = require("web3");

/**
 * 获取用户在eth、bsc、polygon上的usdc，usdt, dai余额
 * @param {*} user_eth_address 
 * @returns 
 */
async function getBalanceOfAllNet(user_eth_address){
    const eth_provider = config.eth.Provider;
    const eth_Web3Client = new Web3(new Web3.providers.HttpProvider(eth_provider));
    var usdt = await getBalanceOf(eth_Web3Client, config.eth.ABI, config.eth.USDT, config.eth.USDT_Unit, user_eth_address);
    var usdc = await getBalanceOf(eth_Web3Client, config.eth.ABI, config.eth.USDC, config.eth.USDC_Unit, user_eth_address);
    var dai = await getBalanceOf(eth_Web3Client, config.eth.ABI, config.eth.DAI, config.eth.DAI_Unit, user_eth_address);
    // console.log("eth");
    // console.log("usdt:" + usdt);
    // console.log("usdc:" + usdc);
    // console.log("dai:" + dai);

    const polygon_provider = config.polygon.Provider;
    const polygon_Web3Client = new Web3(new Web3.providers.HttpProvider(polygon_provider));
    var usdt2 = await getBalanceOf(polygon_Web3Client, config.polygon.ABI, config.polygon.USDT, config.polygon.USDT_Unit, user_eth_address);
    var usdc2 = await getBalanceOf(polygon_Web3Client, config.polygon.ABI, config.polygon.USDC, config.polygon.USDC_Unit, user_eth_address);
    var dai2 = await getBalanceOf(polygon_Web3Client, config.polygon.ABI, config.polygon.DAI, config.polygon.DAI_Unit, user_eth_address);
    // console.log("polygon");
    // console.log("usdt:" + usdt2);
    // console.log("usdc:" + usdc2);
    // console.log("dai:" + dai2);

    const bsc_provider = config.bsc.Provider;
    const bsc_Web3Client = new Web3(new Web3.providers.HttpProvider(bsc_provider));
    var usdt3 = await getBalanceOf(bsc_Web3Client, config.bsc.ABI, config.bsc.USDT, config.bsc.USDT_Unit, user_eth_address);
    var usdc3 = await getBalanceOf(bsc_Web3Client, config.bsc.ABI, config.bsc.USDC, config.bsc.USDC_Unit, user_eth_address);
    var dai3 = await getBalanceOf(bsc_Web3Client, config.bsc.ABI, config.bsc.DAI, config.bsc.DAI_Unit, user_eth_address);
    // console.log("polygon");
    // console.log("usdt:" + usdt3);
    // console.log("usdc:" + usdc3);
    // console.log("dai:" + dai3);

    var final_result = {
        
        eth:{
            usdt: usdt,
            usdc: usdc,
            dai: dai,
        }, 
        polygon:{
            usdt: usdt2,
            usdc: usdc2,
            dai: dai2,
        },
        bsc:{
            usdt: usdt3,
            usdc: usdc3,
            dai: dai3,
        }
    };

    // console.log(final_result);

    return final_result;
}


async function getBalanceOf(Web3Client, ABI, contract_address, token_unit, user_eth_address){
    const contract = new Web3Client.eth.Contract(ABI, contract_address);
    const result = await contract.methods.balanceOf(user_eth_address).call();
    // console.log("result:" + result);
    const token_format = Web3Client.utils.fromWei(result, token_unit);
    // console.log("token_format:" + token_format);
    return token_format;
}

/**
 * 计算US总数
 * @param {*} user_eth_address 
 * @returns 
 */
async function getTotalDollar(user_eth_address){
    var tokens = await getBalanceOfAllNet(user_eth_address);
    var total = calculate_property(tokens);
 
    return total;
}

function calculate_property(tokens){
    var total = 0.0 ;
    total +=  parseFloat(tokens.eth.usdc);
    total +=  parseFloat(tokens.eth.usdt);
    total +=  parseFloat(tokens.eth.dai);
    total +=  parseFloat(tokens.polygon.usdc);
    total +=  parseFloat(tokens.polygon.usdt);
    total +=  parseFloat(tokens.polygon.dai);
    total +=  parseFloat(tokens.bsc.usdc);
    total +=  parseFloat(tokens.bsc.usdt);
    total +=  parseFloat(tokens.bsc.dai);
    return total;
}

module.exports = {
    getBalanceOfAllNet: getBalanceOfAllNet,
    getTotalDollar: getTotalDollar,
    calculate_property: calculate_property
}

// getBalanceOfETH("0x28C6c06298d514Db089934071355E5743bf21d60");
// getBalanceOfETH("0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063");
// getTotalDollar("0x28C6c06298d514Db089934071355E5743bf21d60");