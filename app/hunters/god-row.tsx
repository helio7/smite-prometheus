import Image from "next/image";

export default function GodsTable({
  gods,
}: {
  gods: {
    codename: string,
    name: string,
    speed_at_level_20: number,
  }[],
}) {
  return (
    <div style={{
      display: 'flex',
      // justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid black',
      padding: '2px',
      backgroundColor: 'orange',
      width: '250px',
      // paddingBottom: '-5px',
    }}>
      <Image
        src={`/gods_icons/'codename'.png`}
        style={{
          
        }}
        alt={`${name}'s profile picture`}
        width={56}
        height={56}
      />
      <div style={{
        // display: 'flex',
        // flexDirection: 'column',
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: 'yellow',
        width: '100%',
        textAlign: 'center',
      }}>
        <span style={{
          marginLeft: '2px',
          marginRight: '2px',
        }}>{/* name */}</span>
      </div>
      {/* <div style={{
        width: '56px',
        height: '56px',
        backgroundColor: 'red',
        border: '1px solid black',
      }}>
      </div> */}
    </div>
  ); 
}
