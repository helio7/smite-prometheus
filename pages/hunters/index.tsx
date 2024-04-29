import clientPromise from "../../lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from 'react';
import GodsTable from "./gods-table";

export interface SortedHunter {
  codename: string;
  name: string;
  attack_speed: number;
  attack_speed_per_level: number;
  damage: number;
  damage_per_level: number;
}

type DbQueryResult = {
  success: boolean;
  sortedHunters: SortedHunter[];
};

export const getServerSideProps: GetServerSideProps<
  DbQueryResult
> = async () => {
  try {
    await clientPromise;
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    const db = (await clientPromise).db("smite-prometheus").collection("gods");

    const gods = await db.find({}).toArray();

    const sortedHunters = gods.sort((a: any, b: any) => {
      // Alphabetically
      return a.name.localeCompare(b.name);
    }).map((god: any) => {
      return {
        codename: god.codename,
        name: god.name,
        attack_speed: god.attack_speed,
        attack_speed_per_level: god.attack_speed_per_level,
        damage: god.damage,
        damage_per_level: god.damage_per_level,
      };
    });

    return {
      props: { success: true, sortedHunters },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { success: false, sortedHunters: [] },
    };
  }
};

export interface SortingCriteria {
  criteria: 'name' | 'attack_speed' | 'damage' | 'dps';
  direction: 'asc' | 'desc';
}

export default function HuntersPage({
  success,
  sortedHunters,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [hunters, setHunters] = useState(sortedHunters);
  const [sortingCriteria, setSortingCriteria] = useState({
    criteria: 'name',
    direction: 'asc',
  } as SortingCriteria);
  const [level, setLevel] = useState(20);

  function recalculate(criteria: string, direction: string, level: number) {
    let sortingCallback;
    switch (criteria) {
      case 'name':
        sortingCallback = (a: SortedHunter, b: SortedHunter) => {
          if (direction === 'asc') return a.name.localeCompare(b.name);
          else return b.name.localeCompare(a.name);
        };
        break;
      case 'attack_speed':
        sortingCallback = (a: SortedHunter, b: SortedHunter) => {
          const aAttackSpeed = a.attack_speed + a.attack_speed_per_level * level / 100;
          const bAttackSpeed = b.attack_speed + b.attack_speed_per_level * level / 100;
          if (direction === 'asc') return aAttackSpeed - bAttackSpeed;
          else return bAttackSpeed - aAttackSpeed;
        };
        break;
      case 'damage':
        sortingCallback = (a: SortedHunter, b: SortedHunter) => {
          const aDamage = a.damage + a.damage_per_level * level;
          const bDamage = b.damage + b.damage_per_level * level;
          if (direction === 'asc') return bDamage - aDamage;
          else return bDamage - aDamage;
        }
        break;
      case 'dps':
        sortingCallback = (a: SortedHunter, b: SortedHunter) => {
          const aDps = (a.damage + a.damage_per_level * level) * (a.attack_speed + a.attack_speed_per_level * level / 100);
          const bDps = (b.damage + b.damage_per_level * level) * (b.attack_speed + b.attack_speed_per_level * level / 100);
          if (direction === 'asc') return bDps - aDps;
          else return bDps - aDps;
        };
        break;
      default:
        break;
    }
    setHunters([...hunters].sort(sortingCallback));
  }

  function toggleSortDirection(criteria: 'name' | 'attack_speed' | 'damage' | 'dps') {
    if (sortingCriteria.criteria === criteria) {
      if (sortingCriteria.direction === 'asc') {
        setSortingCriteria({ criteria, direction: 'desc' });
      } else {
        setSortingCriteria({ criteria, direction: 'asc' });
      }
      setHunters([...hunters].reverse());
    } else {
      let direction: 'asc' | 'desc' = 'asc';
      if (['attack_speed', 'damage', 'dps'].includes(criteria)) direction = 'desc';
      setSortingCriteria({ criteria, direction });
      recalculate(criteria, direction, level);
    }
  }

  function increaseLevel() {
    const newLevel = level + 1;
    setLevel(newLevel);
    const { criteria, direction } = sortingCriteria;
    recalculate(criteria, direction, newLevel);
  }

  function decreaseLevel() {
    const newLevel = level - 1;
    setLevel(newLevel);
    const { criteria, direction } = sortingCriteria;
    recalculate(criteria, direction, newLevel);
  }

  return (
    <main style={{
      backgroundColor: 'lightgray',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid black',
      paddingBottom: '20px',
    }}>
      <h1 style={{
        font: '40px bold Arial, Helvetica, sans-serif',
      }}>Hunters</h1>
      <Link href="/" style={{ marginBottom: '10px' }}>
        <span>Back</span>
      </Link>

      <GodsTable
        gods={hunters}
        toggleSortDirection={toggleSortDirection}
        increaseLevel={increaseLevel}
        decreaseLevel={decreaseLevel}
        level={level}
        sortingCriteria={sortingCriteria}
      />
    </main>
  );
}
