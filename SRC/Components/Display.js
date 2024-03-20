import React from 'react'
import {StyleSheet, Text, View, ScrollView} from 'react-native'

const styles = StyleSheet.create({
    display:{
        flex:1.4,
        padding: 8,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'flex-end',
    },

    displayValue:{
        fontSize: 60,
        color: '#fff',

    }
})

export default porps => 

    <View style={styles.display}>
        <ScrollView horizontal={true}>
            <Text style={styles.displayValue} numberOfLines={1}> 
             {porps.value}
             </Text>
        </ScrollView>
        
    </View>