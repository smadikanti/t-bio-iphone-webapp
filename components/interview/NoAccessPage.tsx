// export function NoAccessPage() {
//     const styles = {
//         container: {
//             height: '100vh', // Full viewport height
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'center',
//             alignItems: 'center',
//             textAlign: 'center',
//             backgroundColor: '#f2f2f2', // Light gray background
//             color: '#333', // Dark text for contrast
//             fontFamily: 'Arial, sans-serif', // Clean, sans-serif font
//             padding: '20px'
//         },
//         message: {
//             maxWidth: '600px', // Max width for readability
//             padding: '20px',
//             backgroundColor: 'white',
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
//             borderRadius: '10px', // Rounded corners
//             margin: '20px',
//             lineHeight: '1.6' // Improved line spacing
//         },
//         additionalInfo: {
//             color: '#555', // Slightly lighter text
//             fontSize: '14px', // Smaller font size
//         }
//     };

//     return (
//         // <div style={styles.container}>
//             <div style={styles.message}>
//                 <h1>Sorry, either your session hasn't started yet or you do not have access to this session. Please check your token and try again.</h1>
//                 <p style={styles.additionalInfo}>
//                     We are evaluating if you have a valid session booked. If you see this page more than 5 seconds, consider that you don't have a valid session.
//                 </p>
//             </div>
//         // </div>
//     );
// }

export function NoAccessPage() {
    const styles = {
        container: {
            height: '100vh', // Full viewport height
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: '#f2f2f2', // Light gray background
            color: '#333', // Dark text for contrast
            fontFamily: 'Arial, sans-serif', // Clean, sans-serif font
            padding: '20px'
        },
        message: {
            maxWidth: '600px', // Max width for readability
            padding: '20px',
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
            borderRadius: '10px', // Rounded corners
            margin: '20px',
            lineHeight: '1.6' // Improved line spacing
        },
        additionalInfo: {
            color: '#555', // Slightly lighter text
            fontSize: '14px', // Smaller font size
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.message}>
            <h1>We are evaluating if you have a valid session. If you see this page more than 5 seconds, consider that you don't have a valid session.</h1>
                <h1></h1>
                <p style={styles.additionalInfo}>
                Your session may have ended, or the token entered is incorrect. Please check your token and retry.
                </p>
            </div>
        </div>
    );
}
