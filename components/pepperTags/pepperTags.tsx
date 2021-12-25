import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { space_unit, white, fontSizeBody } from '../../styles/common'
import PepperIcon from '../pepperIcon/pepperIcon'
import { LinearGradient } from 'expo-linear-gradient'

const PepperTag = (tagProps: {
  iconName?: string, text: string,
  firstGradientColor: string,
  secondGradientColor: string,
  style?: any,
}) => {
  return (
    <View style={{...styles.container , ...tagProps.style}}>
      <LinearGradient 
        colors={[tagProps.firstGradientColor, tagProps.secondGradientColor]}
        style={styles.content}
        start={{
          x: 0,
          y: .5,
        }}
        end={{
          x: 1,
          y: .5,
        }}>
        <Text style={styles.tagDescription}>{tagProps.text}</Text>
        { tagProps.iconName ? <PepperIcon name={tagProps.iconName} color={white} size={3.5 * space_unit} style={{ marginLeft: 1 * space_unit }} /> : null }
      </LinearGradient>
    </View>

  )
}

export default PepperTag

const styles = StyleSheet.create({
  container: {
    shadowColor: white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 2 * space_unit,
    paddingVertical: 1 * space_unit,
    borderRadius: 2.8 * space_unit,
  },
  tagDescription: {
    fontSize: fontSizeBody,
    color: white,
  }
})