import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';
import { Icon } from 'react-native-eva-icons';

const Chosen = ({
    containerStyle = {},
    items = null,
    selectedItems = null,
    onChange = null,
    itemPrefix = '#',
    closeDropDown = null,
}) => {
    const [dropDown, setDropDown] = useState(false);
    const [chosenItems, setChosenItems] = useState([]);
    const [chosenSelected, setChosenSelected] = useState([]);
    const [text, setText] = useState(null);

    const filter = (text) => {
        setText(text);
        setChosenItems([
            ...items.filter((item) => item.name.includes(text) && !chosenSelected.includes(item)),
        ]);
    };

    const handleOnAdd = (item) => {
        if (onChange) {
            let _chosenItems = [...chosenItems];
            _chosenItems.splice(chosenItems.indexOf(item), 1);
            setChosenItems(_chosenItems);
            onChange([...selectedItems, item]);
        }
    };

    const handleOnAddText = (text) => {
        let itemFromCollection = items.filter((item) => item.id && item.name == text);
        let exists = selectedItems.filter((item) => item.name == text);

        if (!exists[0]) {
            onChange([...selectedItems, itemFromCollection[0] || { name: text }]);
        }

        if (itemFromCollection[0]) {
            let _chosenItems = [...chosenItems];
            _chosenItems.splice(chosenItems.indexOf(itemFromCollection[0]), 1);
            setChosenItems(_chosenItems);
        }
    };

    const handleOnDelete = (deleteItem) => {
        if (onChange) {
            selectedItems.splice(selectedItems.indexOf(deleteItem), 1);

            if (deleteItem.id) {
                setChosenItems([...chosenItems, deleteItem]);
            }

            onChange([...selectedItems]);
        }
    };

    useEffect(() => {
        setChosenItems(items);
    }, [items]);

    useEffect(() => {
        let _chosenItems = [...chosenItems];
        let _selectedItems = [...selectedItems];

        _selectedItems = _selectedItems.map((item) => item.name);
        _chosenItems = _chosenItems.filter((item) => {
            return !_selectedItems.includes(item.name);
        });

        setChosenItems(_chosenItems);
        setChosenSelected(selectedItems);
    }, [selectedItems]);

    useEffect(() => {
        setDropDown(false);
    }, [closeDropDown]);

    const styles = StyleSheet.create({
        container: {
            ...{
                flexDirection: 'row',
                flexWrap: 'wrap',
                borderColor: '#DDD',
                borderWidth: 1,
                borderBottomLeftRadius: dropDown && chosenItems.length > 0 ? 0 : 7,
                borderBottomRightRadius: dropDown && chosenItems.length > 0 ? 0 : 7,
                borderTopLeftRadius: 7,
                borderTopRightRadius: 7,
                paddingHorizontal: 15,
                paddingVertical: 10,
            },
            ...containerStyle,
        },
        selectedItem: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginRight: 7,
            marginBottom: 7,
            padding: 4,
            borderWidth: 1,
            borderRadius: 9,
            borderColor: '#DDD',
            backgroundColor: '#f3f3f3',
        },
        selectedItemText: {
            marginRight: 5,
            color: '#999',
        },
        icon: {
            width: 18,
            height: 18,
            fill: '#999',
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            minWidth: 80,
        },
        arrowIcon: {
            width: 22,
            height: 22,
            fill: '#999',
        },
        input: {
            flex: 1,
            height: 30,
            minWidth: 150,
            paddingVertical: 7,
        },
        dropDownContainer: {
            maxHeight: 100,
            borderLeftWidth: 1,
            borderLeftColor: '#DDD',
            borderRightWidth: 1,
            borderRightColor: '#DDD',
            borderBottomWidth: 1,
            borderBottomColor: '#DDD',
            borderBottomLeftRadius: 3,
            borderBottomRightRadius: 3,
            borderBottomLeftRadius: 7,
            borderBottomRightRadius: 7,
        },
        dropDownItem: {
            paddingHorizontal: 15,
            paddingVertical: 3,
        },
    });

    return (
        <TouchableWithoutFeedback onPress={() => setDropDown(false)}>
            <View>
                <View style={styles.container}>
                    {chosenSelected &&
                        chosenSelected.map((item, index) => (
                            <View style={styles.selectedItem} key={index}>
                                <Text style={styles.selectedItemText}>
                                    {itemPrefix + item.name}
                                </Text>
                                <TouchableOpacity onPress={() => handleOnDelete(item)}>
                                    <Icon name="close-outline" style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    <View style={styles.inputContainer}>
                        <TouchableOpacity onPress={() => setDropDown(!dropDown)}>
                            <Icon
                                style={styles.arrowIcon}
                                name={dropDown ? 'arrow-down-outline' : 'arrow-right-outline'}
                            />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            onFocus={() => setDropDown(true)}
                            onBlur={() => console.log('blur')}
                            onKeyPress={(e) => console.log(e.nativeEvent.key == 'Backspace')}
                            onSubmitEditing={(e) => handleOnAddText(text)}
                            placeholder="Type or click here"
                            value={text}
                            onChangeText={filter}
                        />
                    </View>
                </View>
                {dropDown && chosenItems && (
                    <TouchableWithoutFeedback onBlur={() => console.log('123')}>
                        <View style={styles.dropDownContainer}>
                            <ScrollView nestedScrollEnabled={true}>
                                {chosenItems.map((item, index) => (
                                    <View style={styles.dropDownItem} key={index}>
                                        <TouchableOpacity onPress={() => handleOnAdd(item)}>
                                            <Text>{itemPrefix + item.name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default Chosen;
