import classes from './loading.module.scss'

export default function ProductsLoading() {
  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <div className={classes.skeletonTitle} />
        <div className={classes.skeletonSubtitle} />
      </div>
      <div className={classes.grid}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={classes.card}>
            <div className={classes.cardImage} />
            <div className={classes.cardBody}>
              <div className={classes.skeletonLine} />
              <div className={classes.skeletonLineShort} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
