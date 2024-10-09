import {getUserBySub} from "../repos/userRepo";
import {decrypt} from "./crypto";
import {getWallet} from "../repos/walletUtil";
import {HDNodeWallet} from "ethers";

async function getWalletForUser(sub: string, password: string): Promise<HDNodeWallet>{
    const user = await getUserBySub(sub);
    const mnemonic = decrypt(user.encryptedMnemonic, password, sub);
    return getWallet(mnemonic);
}

export {
    getWalletForUser
}
