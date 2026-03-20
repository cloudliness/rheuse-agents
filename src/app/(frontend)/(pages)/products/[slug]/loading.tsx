import classes from './loading.module.scss'

export default function ProductDetailLoading() {
  return (
    <div className={classes.page}>
      <div className={classes.gallery}>
        <div className={classes.imagePlaceholder} />
      </div>
      <div className={classes.details}>
        <div className={classes.skeletonCategory} />
        <div className={classes.skeletonTitle} />
        <div className={classes.skeletonPrice} />
        <div className={classes.skeletonBlock} />
        <div className={classes.skeletonBlock} />
        <div className={classes.skeletonBtn} />
      </div>
    </div>
  )
}
