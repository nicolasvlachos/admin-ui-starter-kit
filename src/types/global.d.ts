// Stub global namespace types referenced by some components.
// These match the consumer app's domain types; the library only depends on shape.
declare namespace Modules {
	namespace Core {
		namespace Currencies {
			namespace Enums {
				type Currency = string;
			}
			namespace Data {
				interface CurrencyAmountData {
					value: string;
					currency?: string;
					symbol?: string;
				}
				interface CurrencyPairData {
					source?: CurrencyAmountData | null;
					target?: CurrencyAmountData | null;
				}
			}
		}
		namespace Primitives {
			namespace Money {
				namespace Data {
					interface MoneyData {
						amount: number;
						currency: string;
						recordCurrency?: string;
						pair?: { amount?: number | string; currency?: string; formatted?: string } | null;
					}
					interface MoneyPairData {
						primary: MoneyData;
						secondary?: MoneyData;
					}
				}
			}
		}
	}
}
