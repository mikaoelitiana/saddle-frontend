import Notify from "bnc-notify"
import { getEtherscanLink } from "../utils/getEtherscanLink"
import i18next from "i18next"

const notifyNetworks = new Set([1, 3, 4, 5, 42, 56, 100])
const networkId = parseInt(process.env.REACT_APP_CHAIN_ID ?? "1")

export const notify = Notify({
  ...(notifyNetworks.has(networkId)
    ? { dappId: process.env.REACT_APP_NOTIFY_DAPP_ID }
    : {}), // trigger "UI Only Mode" when on a testnet https://docs.blocknative.com/notify#ui-only-mode
  networkId,
  desktopPosition: "topRight" as const,
  darkMode: false,
})

export function notifyHandler(
  hash: string,
  type: "deposit" | "withdraw" | "swap" | "tokenApproval" | "migrate",
): void {
  const { emitter } = notify.hash(hash)

  emitter.on("txPool", (transaction) => {
    if (transaction.hash) {
      return {
        message: i18next.t("txPool", { context: type }),
        link: getEtherscanLink(transaction.hash, "tx"),
      }
    }
  })
  emitter.on("txSent", () => {
    return {
      message: i18next.t("txSent", { context: type }),
    }
  })
  emitter.on("txConfirmed", () => {
    return {
      message: i18next.t("txConfirmed", { context: type }),
    }
  })
  emitter.on("txSpeedUp", (transaction) => {
    if (transaction.hash) {
      return {
        message: i18next.t("txSpeedUp", { context: type }),
        link: getEtherscanLink(transaction.hash, "tx"),
      }
    }
  })
  emitter.on("txCancel", () => {
    return {
      message: i18next.t("txCancel", { context: type }),
    }
  })
  emitter.on("txFailed", (transaction) => {
    if (transaction.hash) {
      return {
        message: i18next.t("txFailed", { context: type }),
        link: getEtherscanLink(transaction.hash, "tx"),
      }
    }
  })
}
