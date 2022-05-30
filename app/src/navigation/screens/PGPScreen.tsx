import OpenPGP from "react-native-fast-openpgp";
import * as React from "react";
import { Formik } from "formik";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";

export const PGPScreen: React.FC = () => {
  const [keyPair, setKeyPair] = React.useState<{
    publicKey: string;
    privateKey: string;
  }>({
    publicKey: "",
    privateKey: ""
  });

  const [formState, setFormState] = React.useState<{name: string, email: string, password: string }>({name: "", email: "", password: ""});
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSubmit = async () => {
      setLoading(true);
      await OpenPGP.generate(formState);;
      setLoading(false);
    };
  }
  return (
    <View style={styles.container}>
      <View>
        <Text>Generate a PGP to sign transactions:</Text>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: ""
          }}
          onSubmit={async data => {
            const output = await OpenPGP.generate({
              name: data.name,
              email: data.email,
              passphrase: data.password
            });
            console.log(data.name);
            setKeyPair(output);
          }}
        >
          {({ submitForm, handleChange, values }) => (
              <View>
                <TextInput
                  placeholder="Name"
                  onChangeText={handleChange("name")}
                  value={values.name.trim()}
                />
                <TextInput
                  placeholder="Email"
                  onChangeText={handleChange("email")}
                  value={values.email.trim()}
                />
                <TextInput
                  placeholder="Password"
                  onChangeText={handleChange("password")}
                  value={values.password.trim()}
                  secureTextEntry={true}
                />
                <Button title="Generate PGP Key Pair" onPress={submitForm} />
              </View>
          )}
        </Formik>

        {!!keyPair && !!keyPair.publicKey && <Text>{keyPair.publicKey}</Text>}
        {!!keyPair && !!keyPair.privateKey && <Text>{keyPair.privateKey}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  }
});
