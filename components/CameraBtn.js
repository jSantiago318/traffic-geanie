import {Button, Divider, Layout, StyleService, Text} from '@ui-kitten/components';

function CameraBtn() {
    return (
        <>
            <Text style={style.title} >Hi</Text>
        </>
    )
}


export default CameraBtn

const style = StyleService.create({
    title: { 
        marginVertical: 4,
        fontSize: 24,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginVertical: 4,
    },
});
