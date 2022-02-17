import styles from './styles';
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Screens } from '../../App';
import { Buffer } from 'buffer';
import { URL } from 'react-native-url-polyfill';

type Props = {
    setScreen: (screen: Screens) => void
    claimData?: {
        claims: string, // A json stringified array of numbers
        callback: string,
        nonce: string
    }
}

const VERIFIED_CLAIMS = {
    1: {
        data: "John Smith",
        signature: "0xc869c8d5dd9613a4956633a6f94800876d91a12a2ee4aae08fbad0529a9d5ae42cb6ed46ce3f12c3370fb60fba730b7b3016262097eb99b7aca8c49eb121e5691c"
    },
    2: {
        data: "19/12/1952",
        signature: "0xf1bedbca7ff88461ad69152832dd7bd2c4b64e341e65a8f3c7a81590715c6ce51ea8cc8dd7be1482bfda2ff131018eb68c4c9c9666f757805f99ce54b1d81e6e1b"
    }
}

const ClaimRequest = ({ setScreen, claimData }: Props) => {
    const [err, setErr] = React.useState<string | null>(null);

    const claims = JSON.parse(claimData?.claims || "[]");
    const claimString = claims.join(", ");

    const callback = Buffer.from(claimData?.callback || "" as string, 'base64').toString('ascii');
    // @ts-ignore typing is non existent for this
    const { hostname } = new URL(callback);

    async function handlePress(accepted: boolean) {
        if (accepted) {
            try {
                await fetch(callback, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        claims: VERIFIED_CLAIMS
                    })
                })
                setScreen("Info")
            } catch (err: any) {
                setErr(err.toString());
            }
        } else {
            setScreen("Info")
        }
    }

    return (
        <View style={styles.container}>
            <Text>{err}</Text>
            <Text style={styles.title}>Claim Request</Text>
            <Text style={styles.claim}>{hostname} is requesting claims: {claimString}</Text>
            <Pressable style={styles.button} onPress={() => handlePress(true)} >
                <Text style={styles.buttonText}>Yes</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => handlePress(false)} >
                <Text style={styles.buttonText}>No</Text>
            </Pressable>
        </View>
    )
}

export default ClaimRequest;