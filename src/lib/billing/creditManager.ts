interface Credit {
  id: string;
  userId: string;
  amount: number;
  type: "promotional" | "refund" | "adjustment";
  expiryDate?: Date;
  usedAmount: number;
  status: "active" | "expired" | "depleted";
  createdAt: Date;
}

export const creditManager = {
  credits: new Map<string, Credit[]>(),

  addCredit: async (userId: string, amount: number, type: Credit["type"]) => {
    const credit: Credit = {
      id: crypto.randomUUID(),
      userId,
      amount,
      type,
      usedAmount: 0,
      status: "active",
      createdAt: new Date(),
    };

    if (!creditManager.credits.has(userId)) {
      creditManager.credits.set(userId, []);
    }
    creditManager.credits.get(userId)?.push(credit);

    return credit;
  },

  useCredit: async (userId: string, amount: number) => {
    const credits = creditManager.credits.get(userId) || [];
    const availableCredits = credits.filter(
      (c) =>
        c.status === "active" &&
        c.amount > c.usedAmount &&
        (!c.expiryDate || c.expiryDate > new Date()),
    );

    let remainingAmount = amount;
    const usedCredits = [];

    for (const credit of availableCredits) {
      const availableAmount = credit.amount - credit.usedAmount;
      const useAmount = Math.min(availableAmount, remainingAmount);

      credit.usedAmount += useAmount;
      remainingAmount -= useAmount;

      if (credit.usedAmount >= credit.amount) {
        credit.status = "depleted";
      }

      usedCredits.push({
        creditId: credit.id,
        amountUsed: useAmount,
      });

      if (remainingAmount <= 0) break;
    }

    return {
      totalUsed: amount - remainingAmount,
      remainingAmount,
      usedCredits,
    };
  },

  getBalance: (userId: string) => {
    const credits = creditManager.credits.get(userId) || [];
    return credits.reduce((total, credit) => {
      if (
        credit.status === "active" &&
        (!credit.expiryDate || credit.expiryDate > new Date())
      ) {
        return total + (credit.amount - credit.usedAmount);
      }
      return total;
    }, 0);
  },
};
