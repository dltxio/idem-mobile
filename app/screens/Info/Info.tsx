import styles from './styles';
import { View, Text } from 'react-native';
import React from 'react';

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

const Info = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Info Screen</Text>
            {Object.entries(VERIFIED_CLAIMS).map(([key, value]) => {
                return <Text style={styles.claim} key={key}>Claim {key}: {value.data}</Text>
            })}
        </View>
    );
}

export default Info;