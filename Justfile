create-screen path screen_name:
    #!/usr/bin/env bash
    cd {{ path }}
    mkdir -p {{ screen_name }}
    
    # Convert TestScreen to testScreen (lowercase first letter)
    styles_name=$(echo "{{ screen_name }}" | awk '{print tolower(substr($0,1,1)) substr($0,2)}')
    
    cat << EOF > {{ screen_name }}/{{ screen_name }}.tsx
    import { Text, View } from "react-native";
    import { useNavigation } from "expo-router";
    import styles from "./${styles_name}Styles"; 

    export const {{ screen_name }} = () => {
        const navigation: any = useNavigation();

        return (
            <View style={styles.container}>
                <Text>{{ screen_name }}</Text>
            </View>
        )
    };

    export default {{ screen_name }}
    EOF

    cat << EOF > {{ screen_name }}/${styles_name}Styles.ts
    import { StyleSheet } from "react-native";

    export const styles = StyleSheet.create({
        container: {
        alignItems: "center",
        width: "100%",
        height: "100%",
        },
    });

    export default styles;
    EOF

create-component path screen_name:
    #!/usr/bin/env bash
    cd {{ path }}
    mkdir -p {{ screen_name }}
    
    # Convert TestScreen to testScreen (lowercase first letter)
    styles_name=$(echo "{{ screen_name }}" | awk '{print tolower(substr($0,1,1)) substr($0,2)}')
    
    cat << EOF > {{ screen_name }}/{{ screen_name }}.tsx
    import { Text, View } from "react-native";
    import styles from "./${styles_name}Styles"; 

    export const {{ screen_name }} = () => {
        return (
            <View style={styles.container}>
                <Text>{{ screen_name }}</Text>
            </View>
        )
    };

    export default {{ screen_name }}
    EOF

    cat << EOF > {{ screen_name }}/${styles_name}Styles.ts
    import { StyleSheet } from "react-native";

    export const styles = StyleSheet.create({
        container: {
        alignItems: "center",
        width: "100%",
        height: "100%",
        },
    });

    export default styles;
    EOF

