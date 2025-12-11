// src/bytesPlan.js
// Funções utilitárias para planos (ex: calcular lucro final)
export function calcProfit(amount, profitPercent) {
  return (amount * profitPercent) / 100;
}

export function calcTotalReturn(amount, profitPercent) {
  return amount + calcProfit(amount, profitPercent);
}
