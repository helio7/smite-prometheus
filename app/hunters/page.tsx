"use client";

import Link from "next/link";
import { useEffect, useState } from 'react';
import GodsTable from "./gods-table";

export interface SortedHunter {
  codename: string;
  name: string;
  attack_speed: number;
  attack_speed_per_level: number;
  damage: number;
  damage_per_level: number;
}

export interface SortingCriteria {
  criteria: 'name' | 'attack_speed' | 'damage' | 'dps';
  direction: 'asc' | 'desc';
}

export default function HuntersPage() {
  const [hunters, setHunters] = useState([]);
  const [sortingCriteria, setSortingCriteria] = useState({
    criteria: 'name',
    direction: 'asc',
  } as SortingCriteria);
  const [level, setLevel] = useState(20);

  useEffect(() => {
    fetch('http://localhost:3000/api')
      .then(res => res.json())
      .then(data => {
        setHunters(data.sortedHunters);
      });
  }, []);

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
