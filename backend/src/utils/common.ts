import {getUserBySub} from "../repo/userRepo";
import {decrypt} from "./crypto";
import {getWallet} from "../repo/walletUtil";
import {HDNodeWallet} from "ethers";

async function getWalletForUser(sub: string, password: string): Promise<HDNodeWallet>{
    const user = await getUserBySub(sub);
    const mnemonic = decrypt(user.encryptedMnemonic, password);
    return getWallet(mnemonic);
}

export {
    getWalletForUser
}
